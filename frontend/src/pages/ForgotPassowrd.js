import React, { useState } from 'react';

const ForgotPassword = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const data = await response.json();
                            console.log(data,"data")
                        if (data.address) {
                            const { road, suburb, state_district, state, country } = data.address;
                            setLocation({
                                street: road || 'N/A',
                                area: suburb || 'N/A',
                                city: state_district || 'N/A',
                                state: state || 'N/A',
                                country: country || 'N/A',
                            });
                        } else {
                            setError('Unable to fetch location details.');
                        }
                    } catch (err) {
                        setError('Error fetching location data.');
                    }
                },
                (error) => {
                    setError('Error getting user location: ' + error.message);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div>
            <h1>Find My Location</h1>
            <button onClick={getUserLocation}>Get My Location</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {location && (
                <div>
                    <h2>Your Location</h2>
                    <p><strong>Street:</strong> {location.street}</p>
                    <p><strong>Area:</strong> {location.area}</p>
                    <p><strong>City:</strong> {location.city}</p>
                    <p><strong>State:</strong> {location.state}</p>
                    <p><strong>Country:</strong> {location.country}</p>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
