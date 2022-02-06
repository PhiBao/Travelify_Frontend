import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  apiCallBegan,
  apiCallSuccess,
  apiCallFailed,
  apiCallPrepare,
} from "./api";
import { setRecentlyWatched } from "../services/tourService";

const slice = createSlice({
  name: "tours",
  initialState: {
    list: [],
    meta: {
      total: 0,
      sortColumn: { path: "createAt", order: "desc" },
    },
    current: {
      self: {
        name: "",
        description: "",
        kind: "",
        details: {},
        price: 0,
        departure: "",
        vehicles: [],
        tags: [],
        images: [],
        rate: 0,
        marked: false,
        reviews: [
          {
            user: { username: "", avatarUrl: "" },
            id: 0,
            body: "",
            hearts: 0,
            createAt: "",
            liked: false,
            likes: 0,
            state: "appear",
            size: 0,
            comments: [],
          },
        ],
        size: 0,
      },
      related: [],
      recently: [],
      commentsList: [
        {
          user: { username: "", avatarUrl: "" },
          id: 0,
          body: "",
          createAt: "",
          liked: false,
          likes: 0,
          state: "appear",
          size: 0,
          replyTo: "",
          replies: [],
        },
      ],
    },
    loading: false,
  },
  reducers: {
    toursLoaded: (tours, action) => {
      const { list, meta } = action.payload;
      tours.list = list;
      tours.meta.total = meta.total;
    },
    tourGotten: (tours, action) => {
      const { list, self, related, recently } = action.payload;
      tours.list = list;
      tours.current.self = self;
      tours.current.related = related;
      tours.current.recently = recently;
      setRecentlyWatched(self.id);
    },
    tourRequestBooking: () => {
      toast.success("Please wait a moment, Travelify will contact you soon");
    },
    tourMarked: (tours, action) => {
      const { id } = action.payload;
      const index = tours.list.findIndex((tour) => tour.id === id);
      tours.list[index].marked = !tours.list[index].marked;
    },
    reviewDeleted: (tours, action) => {
      const { id } = action.payload;
      const index = tours.current.self.reviews.findIndex(
        (review) => review.id === id
      );
      tours.current.self.reviews.splice(index, 1);
      tours.current.self.size -= 1;
    },
    reviewToggled: (tours, action) => {
      const { id, state } = action.payload;
      const index = tours.current.self.reviews.findIndex(
        (review) => review.id === id
      );
      tours.current.self.reviews[index].state = state;
    },
    reviewLiked: (tours, action) => {
      const { id, liked } = action.payload;
      const index = tours.current.self.reviews.findIndex(
        (review) => review.id === id
      );
      tours.current.self.reviews[index].liked = liked;
      tours.current.self.reviews[index].likes += liked === true ? 1 : -1;
    },
    reviewsLoaded: (tours, action) => {
      const { reviews } = action.payload;
      tours.current.self.reviews = tours.current.self.reviews.concat(reviews);
    },
    commentsLoaded: (tours, action) => {
      const { id, data, ids } = action.payload;
      const index = tours.current.self.reviews.findIndex(
        (review) => review.id === id
      );
      const { comments = [] } = tours.current.self.reviews[index];
      tours.current.self.reviews[index].comments = comments.concat(ids);
      tours.current.commentsList = tours.current.commentsList.concat(data);
    },
    repliesLoaded: (tours, action) => {
      const { id, data, ids } = action.payload;
      const index = tours.current.commentsList.findIndex(
        (comment) => comment.id === id
      );
      const { replies = [] } = tours.current.commentsList[index];
      tours.current.commentsList[index].replies = replies.concat(ids);
      tours.current.commentsList = tours.current.commentsList.concat(data);
    },
    commentDeleted: (tours, action) => {
      const { id, commentableId, commentableType } = action.payload;
      if (commentableType === "Review") {
        const index = tours.current.self.reviews.findIndex(
          (review) => review.id === commentableId
        );
        tours.current.self.reviews[index].size -= 1;
        tours.current.self.reviews[index].comments = tours.current.self.reviews[
          index
        ].comments.filter((comment) => comment.id !== id);
      } else {
        const index = tours.current.commentsList.findIndex(
          (comment) => comment.id === commentableId
        );
        tours.current.commentsList[index].size -= 1;
        tours.current.commentsList[index].replies = tours.current.commentsList[
          index
        ].replies.filter((comment) => comment.id !== id);
      }
      tours.current.commentsList = tours.current.commentsList.filter(
        (comment) => comment.id !== id
      );
    },
    commentCreated: (tours, action) => {
      const { comment, parentId } = action.payload;
      const index = tours.current.self.reviews.findIndex(
        (review) => review.id === parentId
      );
      tours.current.self.reviews[index].size += 1;
      tours.current.commentsList?.unshift(comment);
      let { comments = [] } = tours.current.self.reviews[index];
      comments.unshift(comment.id);
      tours.current.self.reviews[index].comments = comments;
    },
    replyCreated: (tours, action) => {
      const { reply, parentId } = action.payload;
      const index = tours.current.commentsList.findIndex(
        (comment) => comment.id === parentId
      );
      tours.current.commentsList[index].size += 1;
      let { replies = [] } = tours.current.commentsList[index];
      replies.unshift(reply.id);
      tours.current.commentsList[index].replies = replies;
      tours.current.commentsList?.unshift(reply);
    },
    commentToggled: (tours, action) => {
      const { id, state } = action.payload;

      const index = tours.current.commentsList.findIndex(
        (comment) => comment.id === id
      );
      tours.current.commentsList[index].state = state;
    },
    commentLiked: (tours, action) => {
      const { id, liked } = action.payload;
      const index = tours.current.commentsList.findIndex(
        (comment) => comment.id === id
      );
      tours.current.commentsList[index].liked = liked;
      tours.current.commentsList[index].likes += liked === true ? 1 : -1;
    },
    commentEdited: (tours, action) => {
      const { id, body } = action.payload;
      const index = tours.current.commentsList.findIndex(
        (comment) => comment.id === id
      );
      tours.current.commentsList[index].body = body;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apiCallPrepare, (tours) => {
        tours.loading = true;
      })
      .addCase(apiCallSuccess, (tours) => {
        tours.loading = false;
      })
      .addCase(apiCallFailed, (tours) => {
        tours.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

export const {
  tourGotten,
  tourRequestBooking,
  tourPaid,
  tourMarked,
  reviewDeleted,
  reviewToggled,
  reviewsLoaded,
  commentsLoaded,
  commentDeleted,
  repliesLoaded,
  commentCreated,
  replyCreated,
  toursLoaded,
  reviewLiked,
  commentToggled,
  commentLiked,
  commentEdited,
} = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/tours";
const bookings_url = "/bookings";
const reviews_url = "/reviews";
const comments_url = "/comments";

export const getTour = (tourId, data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + `/${tourId}`,
      method: "GET",
      params: data,
      onSuccess: tourGotten.type,
    })
  );
};

export const requestBookingTour = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: bookings_url,
      method: "POST",
      data,
      onSuccess: tourRequestBooking.type,
    })
  );
};

export const markTour = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `${url}/${id}/mark`,
      method: "GET",
      onSuccess: tourMarked.type,
      skipLoading: true,
    })
  );
};

export const deleteReview = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: reviews_url + `/${id}`,
      method: "DELETE",
      onSuccess: reviewDeleted.type,
      skipLoading: true,
    })
  );
};

export const toggleReview = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: reviews_url + `/${id}/toggle`,
      method: "PUT",
      onSuccess: reviewToggled.type,
      skipLoading: true,
    })
  );
};

export const likeReview = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: reviews_url + `/${id}/like`,
      method: "PUT",
      onSuccess: reviewLiked.type,
      skipLoading: true,
    })
  );
};

export const loadReviews = (id, params) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `${url}/${id}/reviews`,
      method: "GET",
      params,
      onSuccess: reviewsLoaded.type,
      skipLoading: true,
    })
  );
};

export const loadComments = (id, params) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `${reviews_url}/${id}/comments`,
      method: "GET",
      params,
      onSuccess: commentsLoaded.type,
      skipLoading: true,
    })
  );
};

export const toggleComment = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: comments_url + `/${id}/toggle`,
      method: "PUT",
      onSuccess: commentToggled.type,
      skipLoading: true,
    })
  );
};

export const likeComment = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: comments_url + `/${id}/like`,
      method: "PUT",
      onSuccess: commentLiked.type,
      skipLoading: true,
    })
  );
};

export const loadReplies = (id, params) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `${comments_url}/${id}/replies`,
      method: "GET",
      params,
      onSuccess: repliesLoaded.type,
      skipLoading: true,
    })
  );
};

export const deleteComment = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `${comments_url}/${id}`,
      method: "DELETE",
      onSuccess: commentDeleted.type,
      skipLoading: true,
    })
  );
};

export const createComment = (id, data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `${reviews_url}/${id}/comment`,
      method: "POST",
      data,
      onSuccess: commentCreated.type,
      skipLoading: true,
    })
  );
};

export const createReply = (id, data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `${comments_url}/${id}/reply`,
      method: "POST",
      data,
      onSuccess: replyCreated.type,
      skipLoading: true,
    })
  );
};

export const loadTours = (params) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url,
      method: "GET",
      params,
      onSuccess: toursLoaded.type,
    })
  );
};

export const editComment = (id, data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: comments_url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: commentEdited.type,
      skipLoading: true,
    })
  );
};

// Selector
