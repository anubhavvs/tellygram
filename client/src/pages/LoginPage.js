import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApolloClient, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOGIN_USER } from '../graphql/mutations';
import { useAuthContext } from '../context/auth';
import { useStateContext } from '../context/state';
import { getErrorMessage } from '../utils/helperFunctions';
import ErrorAlert from '../components/ErrorAlert';

const schema = yup.object({
    username: yup.string().required('Username required!'),
    password: yup.string().required('Password required!')
});

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const { setUser } = useAuthContext();
    const { notify } = useStateContext();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    });
    const client = useApolloClient();
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        onError: (err) => {
            setErrorMessage(getErrorMessage(err));
        }
    })
    const onSubmit = ({username, password}) => {
        loginUser({
            variables: { username, password },
            update: (_, { data }) => {
                setUser(data.login);
                notify(`Welcome back, ${data.login.username}!`);
                reset();
            },
        });
        client.clearStore();
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                <h2 className="mt-6 text-left text-3xl font-extrabold text-gray-900">Login into your account!</h2>
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
                </div>

                <div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                        Log in
                    </button>
                </div>
                </form>
            </div>
            <ErrorAlert errorMessage={errorMessage} clearErrorMessage={() => setErrorMessage(null)} />
        </div>
    )
}

export default LoginPage;
