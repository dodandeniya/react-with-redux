import * as types from "./actionTypes";
import * as coursesApi from '../../api/courseApi';
import { beginApiCall, apiCallError } from './apiStatusActions';

export function loadCourseSuccess(courses) {
    return { type: types.LOAD_COURSES_SUCCESS, courses };
}

export function saveCourseSuccess(course) {
    return { type: types.CREATE_COURSE_SUCCESS, course };
}

export function updateCourseSuccess(course) {
    return { type: types.UPDATE_COURSE_SUCCESS, course };
}

export function deleteCourseOptimistic(course) {
    return { type: types.DELETE_COURSE_OPTIMISTIC, course }
}


export function loadCourses() {
    return function (dispatch) {
        dispatch(beginApiCall());
        return coursesApi.getCourses().then(courses => {
            dispatch(loadCourseSuccess(courses));
        }).catch(error => {
            dispatch(apiCallError(error));
            throw error;
        })
    }
}

export function saveCourse(course) {
    return function (dispatch, getState) {
        dispatch(beginApiCall());
        return coursesApi.saveCourse(course).then(savedCourse => {
            course.id ? dispatch(updateCourseSuccess(savedCourse)) : dispatch(saveCourseSuccess(savedCourse));
        }).catch(error => {
            dispatch(apiCallError(error));
            throw error;
        })
    }
}

export function deleteCourse(course) {
    return function (dispatch) {
        // Doing optimistic delete, so not dispatching begin/end api call
        // actions, or apiCallError action since we're not showing the loading status for this.
        dispatch(deleteCourseOptimistic(course));
        return coursesApi.deleteCourse(course.id);
    };
}
