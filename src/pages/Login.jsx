import React from 'react';
import { useFormik } from 'formik';
import { loginValidator as validate } from '../utils/helpers/formValidator';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthenticateProvider';

function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      const jsonUser = JSON.stringify(values);
      api
        .post('/auth/login', jsonUser, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success('Login successfull!', { duration: 4000 });
            setIsAuthenticated(true);
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 500);
          }
        })
        .catch((err) => {
          if (err.response.status === 404 || err.response.status === 401) {
            toast.error(err.response.data, { duration: 4000 });
          } else {
            toast.error('Somthing went wrong', { duration: 4000 });
            console.log(err.response.data);
          }
        });
    },
  });
  return (
    <div className="wrapper dark:text grid place-items-center">
      <div className=" mt-[3%] px-10 w-5/12 h-max bg-slate-100 border-4 shadow-xl dark:border-grayshade-300 dark:bg-grayshade-400 rounded-lg">
        <div className="text-center mb-4">
          <h1 className="text-purpleshade-400 font-extrabold text-4xl mb-3 pt-10">
            Login
          </h1>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className=" content-center">
          <div className="form-section">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <span>
              {formik.touched.email && formik.errors.email
                ? `*${formik.errors.email}`
                : null}
            </span>
          </div>

          <div className="form-section">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <span>
              {formik.touched.password && formik.errors.password
                ? `*${formik.errors.password}`
                : null}
            </span>
          </div>
          <div className="w-full grid place-items-center py-4 items-center md:col-span-2">
            <button
              type="submit"
              className="btn w-full bg-indigo-500 hover:bg-indigo-400 text-white">
              Login
            </button>
            <Link to={'/auth/signup'}>
              <p className='py-4'>
                Don't have an account? <span className="text-blue-500">Signup</span>
              </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
