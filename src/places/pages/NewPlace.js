import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationAddress, setLocationAddress] = useState(null);
  const { isLoading, error, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        console.log(position);
        await setLatitude(position.coords.latitude);
        await setLongitude(position.coords.longitude);
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
          { mode: 'cors' }
        )
          .then((response) => {
            console.log(response);
            let res = response.json();
            return res;
          })
          .then((data) => {
            console.log(data);
            setLocationAddress(data.display_name);
          })
          .catch((error) => alert(error));
      }, handleLocationError);
    } else {
      alert('Fitur Geolocation tidak didukung oleh browser anda');
    }
  };

  const handleLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert(
          'Anda tidak mengizinkan untuk akses lokasi, silahkan untuk mengizinkan kembali.'
        );
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Informasi lokasi sedang tidak tersedia, silahkan coba kembali.');
        break;
      case error.TIMEOUT:
        alert(
          'Waktu permintaan akses lokasi telah habis, silahkan coba kembali.'
        );
        break;
      case error.UNKNOWN_ERROR:
        alert('Sedang terjadi kesalahan, silahkan coba kembali.');
        break;
      default:
        alert('Sedang terjadi kesalahan, silahkan coba kembali.');
    }
  };

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      await Axios.post(
        'https://learn-mernstack.herokuapp.com/api/places',
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
        }
      );
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Button type="button" onClick={() => getLocation()}>
          Bagikan Lokasi
        </Button>
        {latitude ? <p>{locationAddress}</p> : null}
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
