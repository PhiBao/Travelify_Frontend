import { createAction } from "@reduxjs/toolkit";

export const apiCallPrepare = createAction("api/callPrepare");
export const apiCallBegan = createAction("api/callBegan");
export const apiCallSuccess = createAction("api/callSuccess");
export const apiCallFailed = createAction("api/callFailed");
