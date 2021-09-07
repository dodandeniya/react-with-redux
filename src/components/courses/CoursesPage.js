import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import * as courseActions from '../../redux/actions/coursesActions';
import * as authorActions from '../../redux/actions/authorsActions';
import CourseList from './CourseList';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';

class CoursesPage extends React.Component {
    state = {
        redirectToCoursePage: false,
    };

    componentDidMount() {
        const { courses, authors, actions } = this.props;

        if (courses.length === 0) {
            actions.loadCourses().catch(error => {
                alert("Loading courses failed" + error);
            });
        }

        if (authors.length === 0) {
            actions.loadAuthors().catch(error => {
                alert("Loading authors failed" + error);
            });
        }
    }

    handelDeeteCourse = course => {
        toast.success('Course deleted');
        this.props.actions.deleteCourse(course).catch(error => {
            toast.error('Delete failed. ' + error.message, { autoClose: false });
        });
    };

    render() {
        return (
            <>
                {this.state.redirectToCoursePage && <Redirect to='/course' />}
                <h2>Courses</h2>
                {this.props.loading ?
                    <Spinner /> : (
                        <>
                            <button style={{ marginBottom: 20 }} className='btn btn-primary add-course' onClick={() => this.setState({ redirectToCoursePage: true })}>
                                Add Course
                </button>

                            <CourseList onDeleteClick={this.handelDeeteCourse} courses={this.props.courses} />
                        </>
                    )}
            </>
        );
    }
}

CoursesPage.propTypes = {
    courses: PropTypes.array.isRequired,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
    return {
        courses: state.authors.length === 0 ? [] : state.courses.map(
            course => {
                return {
                    ...course,
                    authorName: state.authors.find(a => a.id === course.authorId).name
                };
            }),
        authors: state.authors,
        loading: state.apiCallsInProgress > 0,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
            loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
            deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch)
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);