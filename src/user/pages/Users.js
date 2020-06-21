import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { connect, useDispatch } from 'react-redux';
import { getUser } from '../../redux/actions/place';

const Users = (props) => {
  const { isLoading, error, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await dispatch(getUser());
        // Axios.get(
        //   'https://learn-mernstack.herokuapp.com/api/users'
        // );
        await console.log('test WOOOO', responseData.value);

        await setLoadedUsers(responseData.value.data.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};
const mapStateToProps = (place) => {
  return {
    place,
  };
};

export default connect(mapStateToProps)(Users);
