import React, { useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTour } from "../../store/tours";
import { Input, Button, Select } from "../common/form";
import Loading from "../layout/loading";
import "../common/form.scss";
import "./tourForm.scss";

const schema = Yup.object().shape({
  name: Yup.string().max(255).required(),
  description: Yup.string().max(500).nullable(),
  price: Yup.number()
    .typeError("Must specify a number")
    .required()
    .positive()
    .integer(),
  kind: Yup.string()
    .oneOf(["single", "fixed"], "Tour must belongs to a kind")
    .required(),
  limit: Yup.number().when("kind", {
    is: "fixed",
    then: Yup.number()
      .typeError("Must specify a number")
      .required("Fixed tour must has a limit")
      .positive()
      .integer(),
    otherwise: Yup.number().typeError("Must specify a number").nullable(),
  }),
  departureDay: Yup.date().when("kind", {
    is: "fixed",
    then: Yup.date().required("Fixed tour must has departure day"),
    otherwise: Yup.date().nullable(),
  }),
  terminalDay: Yup.date().when("kind", {
    is: "fixed",
    then: Yup.date().required("Fixed tour must has terminal day"),
    otherwise: Yup.date().nullable(),
  }),
  time: Yup.string().when("kind", {
    is: "single",
    then: Yup.string()
      .required("Single tour must has a time")
      .matches(
        /\d+-\d+/,
        "Time has format: {Number of days}-{Numbers of nights}"
      ),
    otherwise: Yup.string().nullable(),
  }),
  images: Yup.mixed()
    .required()
    .test("fileSize", "The file is too large", (value) => {
      for (let i = 0; i < value.length; i++) {
        if (value[i] > 5242880) return false;
      }
      return true;
    })
    .test("type", "We support png, jpg, gif file", (value) => {
      for (let i = 0; i < value.length; i++) {
        if (!["image/png", "image/jpeg", "image/gif"].includes(value[i].type))
          return false;
      }
      return true;
    }),
});

export const TourForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    clearErrors,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { loading, createTour } = props;
  const navigate = useNavigate();

  const handleKindChange = (e) => {
    const { value } = e.target;
    switch (value) {
      case "fixed":
        resetField("time");
        break;
      case "single":
        resetField("departureDay");
        resetField("terminalDay");
        resetField("limit");
        break;
      default:
        return;
    }
    clearErrors();
    setKind(value);
  };

  const [kind, setKind] = useState("");

  const onSubmit = async (tour, e) => {
    e.preventDefault();

    if (tour.kind === "fixed") {
      const time = moment(tour.terminalDay).diff(
        moment(tour.departureDay),
        "hours"
      );
      if (time < 6) {
        setError("terminalDay", {
          type: "manual",
          message:
            "Terminal day must be after at least six hours departure day",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", tour.name);
    formData.append("description", tour.description);
    formData.append("kind", tour.kind);
    if (tour.kind === "fixed") {
      formData.append("limit", tour.limit);
      formData.append("departure_day", tour.departureDay);
      formData.append("terminal_day", tour.terminalDay);
    }
    if (tour.kind === "single") formData.append("time", tour.time);
    formData.append("price", tour.price);
    for (let i = 0; i < tour.images.length; i++) {
      formData.append("images[]", tour.images[i]);
    }

    await createTour(formData);
    navigate("/tours");
  };

  return (
    <section className="vh-100 pt-5">
      {loading && <Loading />}
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Create a tour
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row ms-1 mb-3">
                      <label
                        htmlFor="images"
                        className="mb-3 d-none fs-5 d-inline-flex align-items-center justify-content-center
                                   col-3 badge bg-warning text-dark col-form-label d-sm-block"
                      >
                        Images
                      </label>
                      <div className="col">
                        <input
                          {...register("images")}
                          className="custom-file-input btn button border form-control form-control-lg"
                          type="file"
                          multiple
                          name="images"
                          accept=".jpg, .gif, .png"
                        />
                        <p className="text-muted d-none d-sm-block">
                          Allowed JPG, GIF or PNG. Max size of 5MB
                        </p>
                      </div>
                      <div className="alert text-danger p-0 mb-0 fade show">
                        {errors.images?.message}
                      </div>
                    </div>
                    <Input
                      register={register}
                      name="name"
                      label="Name"
                      spacingClass="mb-4 pb-4"
                      error={errors.name}
                    />
                    <Input
                      register={register}
                      name="description"
                      label="Description"
                      spacingClass="mb-5"
                      error={errors.description}
                    />
                    <Select
                      register={register}
                      name="kind"
                      label="Kind"
                      options={["single", "fixed"]}
                      custom={{
                        onChange: handleKindChange,
                        onBlur: handleKindChange,
                      }}
                      error={errors.kind}
                      value={kind}
                    />
                    {kind === "fixed" && (
                      <>
                        <Input
                          register={register}
                          name="limit"
                          label="Limit"
                          spacingClass="pt-5"
                          error={errors.limit}
                          type="number"
                        />
                        <Input
                          register={register}
                          name="departureDay"
                          label="Departure day"
                          spacingClass="mb-5"
                          error={errors.departureDay}
                          type="datetime-local"
                        />
                        <Input
                          register={register}
                          name="terminalDay"
                          label="Terminal day"
                          spacingClass="mb-5"
                          error={errors.terminalDay}
                          type="datetime-local"
                        />
                      </>
                    )}
                    {kind === "single" && (
                      <Input
                        register={register}
                        name="time"
                        label="Time"
                        spacingClass="pb-5"
                        error={errors.time}
                      />
                    )}
                    <Input
                      register={register}
                      name="price"
                      label="Price"
                      spacingClass="pt-5"
                      error={errors.price}
                      type="number"
                    />

                    <Button
                      label="Create"
                      alignClass="d-flex justify-content-center"
                      styleClass="btn-success text-body"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.tours.loading,
});

const mapDispatchToProps = (dispatch) => ({
  createTour: (data) => dispatch(createTour(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TourForm);
