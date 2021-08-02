export const getErrorMessage = (err) => {
    if(err.graphQLErrors[0]?.message) {
        return err.graphQLErrors[0].message;
    } else {
        return err.message;
    }
};

export const truncateString = (string, maxCharLimit) => {
    return string.length < maxCharLimit
      ? string
      : string.slice(0, maxCharLimit) + '...';
};