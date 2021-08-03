import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApolloClient, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { REGISTER_USER } from '../graphql/mutations';
import { useAuthContext } from '../context/auth';
import { useStateContext } from '../context/state';
import { getErrorMessage } from '../utils/helperFunctions';
import ErrorAlert from '../components/ErrorAlert';

const schema = yup.object({
    username: yup
        .string()
        .required('Username required!')
        .max(20, 'Not more than 20 characters!')
        .min(5, 'Not less than 5 characters!')
        .matches(
            /^[a-zA-Z0-9-_]*$/,
            'Only letters, numbers, underscores and hyphens allowed!'
        ),
    password: yup
        .string()
        .required('Password required!')
        .min(8, 'Not less than 8 characters!')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            'Must contain One Letter and One Number!'
        ),
    confirmPassword: yup
        .string()
        .required('Password required!')
        .oneOf([yup.ref('password'), null], 'Passwords don\'t match!')
});

const RegisterPage = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const { setUser } = useAuthContext();
    const { notify } = useStateContext();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    });
    const client = useApolloClient();
    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        onError: (err) => {
            setErrorMessage(getErrorMessage(err));
        }
    })
    const onSubmit = ({username, password, confirmPassword}) => {
        if(password !== confirmPassword) {
            return setErrorMessage('Passwords don\'t match!');
        }
        registerUser({
            variables: { username, password },
            update: (_, { data }) => {
                setUser(data.register);
                notify(`Welcome to Tellygram, ${data.register.username}!`);
                reset();
            },
        });
        client.clearStore();
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 sm:px-6">
            <div className="max-w-md w-full space-y-8">
                <div>
                <h2 className="mt-6 text-left text-3xl font-extrabold text-gray-900">Welcome to Tellygram!</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm">
                    <div>
                        <label htmlFor="username" className="sr-only">
                            Username
                        </label>
                        <input
                            autoComplete="off"
                            name="username"
                            id="username"
                            type="username"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 h-14 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Username"
                            {...register('username')}
                        />
                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.username?.message}</span>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 h-14 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            {...register('password')}
                        />
                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.password?.message}</span>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="confirmPassword" className="sr-only">
                            Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 h-14 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm Password"
                            {...register('confirmPassword')}
                        />
                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword?.message}</span>
                    </div>
                </div>

                <div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                        Sign Up
                    </button>
                </div>
                </form>
                <p className="text-center font-medium">Already have an account? <Link to="/login" className="underline text-indigo-600">Log In</Link></p>
            </div>
            <ErrorAlert errorMessage={errorMessage} clearErrorMessage={() => setErrorMessage(null)} />
        </div>
    )
}

export default RegisterPage
