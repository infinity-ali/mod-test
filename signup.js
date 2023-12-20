import React, { useContext, useEffect, useState } from "react";

import {
  Alert,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";

import { useForm } from "react-hook-form";

import { Link, useNavigate, useParams } from "react-router-dom";

import { ErrorMessage } from "@hookform/error-message";

import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/Auth.context";

import LogoSmall from "../../components/misc/LogoSmall";

import InputField from "../../components/misc/inputs/InputFileds";

import RectangleContainer from "../../components/misc/RectangleContainer";

import StyleButton from "../../components/misc/PrimaryButton";
import ModalSignup from "../../components/misc/ModalSignup";
import PhoneInputField from "../../components/misc/inputs/PhoneInputField";
import ModalAggrement from "../../components/Aggrement/ModalAggrement";

const SignupScreen = ({ update }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showMfa, setShowMfa] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { emailParams, cIdParams, cNameParam } = useParams();

  const {
    state: ContextState,
    getUser,
    signup,
    updateUser,
    setregistrationStatus,
    sendCode,
    sendCodeUpdate,
  } = useContext(AuthContext);
  const {
    userDetails,
    registrationStatus,
    optVerified,
    authError,
    loginSuccess,
    optEmailVerified,
    user,
    authLoading,
  } = ContextState;
  useEffect(() => {
    if (update) getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (registrationStatus) {
      setShowMfa(true);
    } else {
      setShowMfa(false);
    }
    if (optVerified && optEmailVerified) {
      if (update) {
        if (Object.keys(data).length) {
          let temp = { ...data };
          if (dirtyFields?.email) {
          } else {
            delete temp.email;
          }
          if (dirtyFields?.userId) {
          } else {
            delete temp.userId;
          }
          if (dirtyFields?.mobile) {
            delete temp.mobile;
          } else {
            delete temp.mobile;
          }
          // delete temp.privacyPolicy;
          delete temp.tenderAlerts;
          updateUser(
            {
              ...temp,
            },
            navigate,
            user,
          );
        }
      } else {
        signup({ ...data }, navigate);
      }
      setShowMfa(false);
    }
    if (loginSuccess) setShowMfa(true);
    console.log({ loginSuccess, registrationStatus, showMfa });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationStatus, optVerified, optEmailVerified, loginSuccess]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: { ...userDetails, mobile: userDetails?.mobile },
  });
  const onSubmit = (inputs) => {
    if (update) {
      if (dirtyFields.email || dirtyFields.mobile) {
        let obj = { ...inputs };
        setEmail(obj.email);
        setPhone(obj.mobile);
        if (dirtyFields?.email) {
        } else {
          delete obj.email;
        }
        if (dirtyFields?.mobile) obj.mobile = `+${inputs.mobile}`;
        if (!dirtyFields?.userId) delete obj.userId;
        if (!dirtyFields?.cId) {
          delete obj.cId;
          delete obj.cName;
        }
        delete obj.privacyPolicy;
        setData({ ...obj });
        let tempObj = {
          email: obj.email,
          mobile: obj.mobile,
          userId: obj.userId,
        };
        if (dirtyFields?.mobile) {
        } else {
          delete tempObj.mobile;
        }
        if (dirtyFields?.email) {
        } else {
          delete tempObj.email;
        }
        sendCodeUpdate({
          ...tempObj,
        });
      } else {
        if (dirtyFields?.cId) {
        } else {
          delete inputs.cId;
          delete inputs.cName;
        }
        if (dirtyFields.userId) {
        } else {
          delete inputs.userId;
        }
        delete inputs.privacyPolicy;
        updateUser(
          {
            ...inputs,
          },
          navigate,
          user,
        );
      }
    } else {
      const temp = {
        ...inputs,
        company: { cId: inputs.cId, name: inputs.cName },
        agreementVersion: "1",
      };
      delete temp.cId;
      delete temp.cName;
      delete temp.privacyPolicy;
      setEmail(inputs.email);
      setPhone(`+${inputs.mobile}`);
      setData({ ...temp, mobile: `+${inputs.mobile}` });
      sendCode({
        email: inputs.email,
        userId: inputs.userId,
        mobile: `+${inputs.mobile}`,
        registration: true,
      });
    }
  };
  useEffect(() => {
    // if (user && !update) {
    //   navigate(-1);
    // }
    if (userDetails) {
      setValue("firstName", userDetails?.firstName);
      setValue("lastName", userDetails?.lastName);
      setValue("email", userDetails?.email);
      setValue("userId", userDetails?.userId);
      setValue("cName", userDetails?.company?.name);
      setValue("cId", userDetails?.company?.cId);
      setValue("mobile", userDetails?.mobile);
    }
    if (registrationStatus) {
      setShowMfa(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails, registrationStatus]);
  console.log("user---------->", user);
  return (
    <div>
      <Container>
        {/* logo  */}
        <LogoSmall
          update={update}
          role={
            user?.permissions?.admin || user?.permissions?.ApproveJoinRequests
          }
        />
        {/* text message  */}
        <div className="d-flex justify-content-center my-3">
          <h2>{t("preHeading")}</h2>
        </div>
        {/* form  */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack className="mx-auto max-w-[600px] flex-column align-items-center">
            <Stack
              direction="horizontal"
              className="justify-content-center align-items-center text-center bg-bgPrimary p-3"
            >
              <h6>{update ? t("update") : t("join")}</h6>
            </Stack>
            <Stack className="justify-content-center  p-4 w-[100%]  bg-color bg-bgSecondary">
              {authError && <Alert variant="danger">{authError}</Alert>}
              <Row className="justify-content-md-center g-3">
                <Col sm={12} md={6}>
                  <InputField
                    styles="flex flex-col gap-2"
                    label={t("firstName")}
                    type="text"
                    placeholder={t("firstNamePlaceholder")}
                    id="text-field"
                    validation={{
                      ...register("firstName", {
                        required: t("required"),
                        pattern: {
                          value: /^[A-Za-zא-ת]+$/i,
                          message: t("invalidFirst"),
                        },
                      }),
                    }}
                    errors={errors}
                    defaultValue={update ? userDetails?.firstName : ""}
                    name="firstName"
                  />
                </Col>
                <Col sm={12} md={6}>
                  <InputField
                    styles="flex flex-col gap-2"
                    label={t("lastName")}
                    type="text"
                    placeholder={t("lastNamePlaceholder")}
                    id="text-field"
                    validation={{
                      ...register("lastName", {
                        required: t("required"),
                        pattern: {
                          value: /^[A-Za-zא-ת]+$/i,
                          message: t("invalidLast"),
                        },
                      }),
                    }}
                    defaultValue={update ? userDetails?.lastName : ""}
                    errors={errors}
                    name="lastName"
                  />
                </Col>
              </Row>
              <Row className="justify-content-md-center mt-3 g-3">
                <Col sm={12} md={6}>
                  <PhoneInputField
                    label={t("mobileNumberLabel")}
                    type="text"
                    // update={update}
                    // defaultValue={update ? userDetails?.mobile : ''}
                    id="text-field"
                    control={control}
                    validation={{
                      ...register("mobile", {
                        required: t("required"),
                        minLength: {
                          value: 10,
                          message: t("invalidPhone"),
                        },
                        maxLength: {
                          value: 13,
                          message: t("maxLen13"),
                        },
                      }),
                    }}
                    errors={errors}
                    name="mobile"
                  />
                </Col>
                <Col sm={12} md={6}>
                  <InputField
                    styles="flex flex-col gap-2"
                    label={t("email")}
                    defaultValue={emailParams ? emailParams : ""}
                    type="email"
                    placeholder="johndoe@gmail.com"
                    id="text-field"
                    validation={{
                      ...register("email", { required: t("required") }),
                    }}
                    errors={errors}
                    name="email"
                  />
                </Col>
              </Row>
              <Row className="justify-content-md-center mt-3 g-3">
                <Col sm={12} md={6} className="d-flex align-items-center">
                  <InputField
                    styles="flex flex-col gap-2"
                    label={t("id")}
                    type="text"
                    // defaultValue={update ? userDetails?.userId : ''}
                    placeholder="123456789"
                    id="text-field"
                    validation={{
                      ...register("userId", {
                        required: t("required"),
                        pattern: {
                          value: /^[0-9]+$/,
                          message: t("invalidPhone"),
                        },
                        minLength: {
                          value: 9,
                          message: t("minLen9"),
                        },
                        maxLength: {
                          value: 9,
                          message: t("maxLen9"),
                        },
                      }),
                    }}
                    errors={errors}
                    name="userId"
                  />
                  {"\u00A0"}{" "}
                </Col>
                <Col sm={12} md={6} className="flex items-center text-[14px]">
                  <span className="d-block mt-[34px]">{t("textSignup")}</span>
                </Col>
              </Row>
              <div className="my-4 mx-auto w-[90%] h-[3px] bg-white"></div>
              <p className="font-bold text-[16px] text-center text-txLabel">
                {t("companyFieldSingup")}
              </p>
              <Row className="md:justify-center mt-3 g-3">
                <Col sm={12} md={6}>
                  <InputField
                    styles="flex flex-col gap-2"
                    label={t("companyLabel")}
                    type="text"
                    placeholder="12345"
                    defaultValue={
                      update
                        ? userDetails?.company?.name
                        : cNameParam
                        ? cNameParam
                        : ""
                    }
                    id="text-field"
                    validation={{
                      ...register("cName", { required: t("required") }),
                    }}
                    errors={errors}
                    disable={!dirtyFields?.cId}
                    name="cName"
                  />

                  <span className="fw-medium text-[11px] text-txLabel mt-4">
                    {t("asAppear")}
                  </span>
                </Col>

                <Col className="input">
                  <InputField
                    styles="flex flex-col gap-2"
                    label={t("companyIdLabel")}
                    type="text"
                    defaultValue={cIdParams && cIdParams}
                    placeholder="12345"
                    id="text-field"
                    validation={{
                      ...register("cId", {
                        required: t("required"),
                        pattern: {
                          value: /^[0-9]+$/,
                          message: t("invalidNum"),
                        },
                        minLength: {
                          value: 5,
                          message: t("len5"),
                        },
                        maxLength: {
                          value: 5,
                          message: t("len5"),
                        },
                      }),
                    }}
                    errors={errors}
                    name="cId"
                  />

                  <span className="fw-medium hidden text-[11px] text-txLabel">
                    {t("asAppear")}
                  </span>
                </Col>
              </Row>
            </Stack>
            <RectangleContainer>
              <div className="text-[14px]">
                <div className="py-2 px-4">
                  <div className="d-flex justify-content-center  flex-column">
                    <div className="d-flex my-2 gap-2 item-center">
                      <input
                        name="tenderAlerts"
                        defaultChecked={!!update}
                        {...register("tenderAlerts")}
                        type="checkbox"
                        className="d-block mt-[4px]"
                      />
                      <span className="d-block text-start">
                        {t("sigupForm2")}
                      </span>
                    </div>
                    <div className="d-flex mt-2 gap-2">
                      <input
                        defaultChecked={!!update}
                        type="checkbox"
                        {...register("privacyPolicy", {
                          required: t("approvePricPolicy"),
                        })}
                        className="d-block mb-[4px]"
                      />
                      <span className="d-block">
                        {t("sigupForm3")}{" "}
                        <span
                          className="text-pri cursor-pointer"
                          onClick={() => setShow(true)}
                        >
                          {" "}
                          {t("sigupForm4")}
                        </span>
                      </span>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="privacyPolicy"
                      render={() => (
                        <p className="text-[12px] text-start  text-[red]">
                          {errors.privacyPolicy?.message}
                        </p>
                      )}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <StyleButton
                    comp={authLoading && <Spinner size="sm" />}
                    title={update ? t("updateAccount") : t("createAccount")}
                    primary={true}
                  />
                </div>
                {
                  <p className="login-route py-2 pb-3">
                    {t("haveAcc")}{" "}
                    <Link
                      to="/login"
                      className="d-inline decoration-none text-pri"
                    >
                      {" "}
                      {t("login")}
                    </Link>
                  </p>
                }
              </div>
            </RectangleContainer>
          </Stack>
        </Form>
        <ModalAggrement
          args={false}
          show={show}
          onHide={() => setShow(!show)}
        />
        <ModalSignup
          email={email}
          phone={phone}
          show={showMfa}
          data={data}
          onHide={() => {
            setregistrationStatus(false);
            setShowMfa(false);
          }}
        />
      </Container>
    </div>
  );
};

export default SignupScreen;
