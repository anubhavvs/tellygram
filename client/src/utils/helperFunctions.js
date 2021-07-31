export const getErrorMessage = (err) => {
    if(err.graphQLErrors[0]?.message) {
        return err.graphQLErrors[0].message;
    } else {
        return err.message;
    }
};