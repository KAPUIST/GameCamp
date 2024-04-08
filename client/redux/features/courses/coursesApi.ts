import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "courses",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "admin/courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `admin/course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `courses/${id}/edit`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getUsersAllCourses: builder.query({
      query: () => ({
        url: "courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseDetails: builder.query({
      query: (id: any) => ({
        url: `courses/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `courses/user/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "courses/question",
        body: {
          question,
          courseId,
          contentId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "courses/answer",
        body: {
          answer,
          courseId,
          contentId,
          questionId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }: any) => ({
        url: `courses/review/${courseId}`,
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }: any) => ({
        url: `courses/reply/review`,
        body: {
          comment,
          courseId,
          reviewId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
} = coursesApi;
