import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_USERS, GET_GROUPS } from '../graphql/queries';
import { CREATE_GROUP } from '../graphql/mutations';
import { useStateContext } from '../context/state.js';
import ErrorAlert from './ErrorAlert';
import { getErrorMessage } from '../utils/helperFunctions';

const schema = yup.object({
    name: yup
        .string()
        .required('Name Required!')
        .max(20, 'Not more than 20 characters!')
        .min(3, 'Not less than 3 characters!')
});

const CreateModal = ({ setShowModal }) => {
    const [ participants, setParticipants ] = useState([]);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [lengthError, setlengthError] = useState('');
    const { selectChat, notify } = useStateContext();
    const inputElement = useRef(null);
    const selectElement = useRef(null);
    const { register, handleSubmit, formState: {errors} } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    });
    const { data: userData } = useQuery(GET_ALL_USERS, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        },
    });
    const [createNewGroup, { loading }] = useMutation(CREATE_GROUP, {
        onError: (err) => {
          setErrorMessage(getErrorMessage(err));
        },
    });

    const handleCreateGroup = ({ name }) => {
        if(participants.length <= 1){
            setlengthError('Need to select atleast 2 users!');
            selectElement.current.focus();
        } else {
            createNewGroup({
                variables: { name, participants },
                update: (proxy, { data }) => {
                  const returnedData = data.createGroup;
                  const dataInCache = proxy.readQuery({
                    query: GET_GROUPS,
                  });
          
                  proxy.writeQuery({
                    query: GET_GROUPS,
                    data: { getGroups: [...dataInCache.getGroups, returnedData] },
                  });
          
                  selectChat(returnedData, 'group');
                  setShowModal(false);
                  notify(`Group created with name ${name}!`);
                },
            });
        }
    };

    const closeModal = (e) => {
        if(e.keyCode === 27) {
            setShowModal(false)
        }
    }

    useEffect(() => {
        if(inputElement.current) {
            inputElement.current.focus();
        }
        window.addEventListener('keydown', closeModal);
        return () => window.removeEventListener('keydown', closeModal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputElement.current]);

    return (
        <div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 select-none">
                <div className="relative my-6 mx-auto max-w-3xl">
                <div className="rounded-lg shadow-lg relative flex flex-col w-max bg-white">
                    <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                        <p className="text-2xl font-semibold">
                            Create A Group
                        </p>
                        <button
                            className="mx-2 border-0 text-black font-semibold"
                            onClick={() => setShowModal(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <form className="flex flex-col space-y-6 px-5 py-6 w-96" onSubmit={handleSubmit(handleCreateGroup)}>
                        <div>
                            <input 
                                name="name"
                                id="name"
                                autoComplete="off"
                                placeholder="Group Name"
                                className="appearance-none rounded-md relative block w-full px-3 py-2 h-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                {...register('name')}
                                ref={inputElement}
                            />
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1 mt-1">{errors.name?.message}</span>
                        </div>
                        <div>
                            <Select
                                ref={selectElement}
                                isSearchable 
                                options={userData.getAllUsers}
                                getOptionLabel={(option) => option.username}
                                getOptionValue={(option) => option.id}
                                onChange={(option) => setParticipants(option.map((o) => o.id))}
                                isMulti
                                required
                                placeholder="Select Users..."
                                onBlur={() => {participants.length <= 1 ? setlengthError('Need to select atleast 2 users!') : setlengthError('')}}
                             />
                            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1 mt-1">{participants.length < 2 ? lengthError : null}</span>
                        </div>
                        <button className="flex flex-row items-center justify-center text-white bg-blue-900 px-6 py-3 rounded-lg outline-none focus:outline-none" type="sumbit" disabled={loading} >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Create New Group
                        </button>
                    </form>
                </div>
                </div>
            </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        <ErrorAlert errorMessage={errorMessage} clearErrorMessage={() => setErrorMessage(null)} />
        </div>
    )
}

export default CreateModal;
