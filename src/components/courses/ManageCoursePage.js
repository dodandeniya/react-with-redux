import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import * as courseActions from '../../redux/actions/coursesActions';
import * as authorActions from '../../redux/actions/authorsActions';
import CourseForm from './CourseForm';
import { newCourse } from '../../../tools/mockData';
import { toast } from 'react-toastify';

function ManageCoursePage({ courses, authors, actions, history, ...props }) {
    const [course, setCourse] = useState({ ...props.course });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        if (courses.length === 0) {
            actions.loadCourses().catch(error => {
                alert("Loading courses failed" + error);
            });
        } else {
            setCourse(props.course);
        }

        if (authors.length === 0) {
            actions.loadAuthors().catch(error => {
                alert("Loading authors failed" + error);
            });
        }
    }, [props.course]);

    function handelChange(event) {
        const { name, value } = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === 'authorId' ? parseInt(value, 10) : value
        }));
    }

    function formIsValid() {
        const { title, authorId, category } = course;
        const errors = {};

        if (!title) errors.title = "Title is required.";
        if (!authorId) errors.author = "Author is required";
        if (!category) errors.category = "Category is required";

        setErrors(errors);
        // Form is valid if the errors object still has no properties
        return Object.keys(errors).length === 0;
    }

    function handelSave(event) {
        event.preventDefault();
        debugger
        if (!formIsValid()) return;
        setSaving(true);
        actions.saveCourse(course).then(() => {
            toast.success('Course saved!');
            history.push('/courses');
        }).catch(error => {
            setSaving(false);
            setErrors({ onSave: error.message });
        });
    }

    return (
        <CourseForm course={course} errors={errors} authors={authors} onChange={handelChange} onSave={handelSave} saving={saving} />
    );

}

ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    courses: PropTypes.array.isRequired,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
}

export function getCourseBySlug(courses, slug) {
    return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, OwnProps) {
    const slug = OwnProps.match.params.slug;
    const course = slug && state.courses.length > 0 ? getCourseBySlug(state.courses, slug) : newCourse;

    return {
        course: course,
        courses: state.authors.length === 0 ? [] : state.courses.map(
            course => {
                return {
                    ...course,
                    authorName: state.authors.find(a => a.id === course.authorId).name
                };
            }),
        authors: state.authors,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
            saveCourse: bindActionCreators(courseActions.saveCourse, dispatch),
            loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);