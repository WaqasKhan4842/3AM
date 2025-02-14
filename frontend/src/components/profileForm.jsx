import { useState } from 'react';
import { Card, TextInput, Textarea, Button, Title, Select, Notification } from '@mantine/core';
import { IconUser, IconMusic, IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';

export function ProfileForm() {
    const [formData, setFormData] = useState({
        profileName: '',
        musicGenre: '',
        performanceDetails: '',
    });

    const [notification, setNotification] = useState(null);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage

            if (!token) {
                setNotification({ message: 'User is not authenticated', success: false });
                return;
            }

            const response = await axios.post(
                'http://localhost:3000/profile/create',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setNotification({ message: 'Profile created successfully', success: true });
            } else {
                setNotification({ message: response.data.message || 'Profile creation failed', success: false });
            }
        } catch (error) {
            console.error(error);
            setNotification({ message: 'An error occurred while creating the profile', success: false });
        }
    };

    return (
        <div className="container">
            <Card shadow="sm" padding="lg" style={{ maxWidth: 600, margin: 'auto' }}>
                <Title order={2} mb="md">Create Profile</Title>

                <TextInput
                    label="Profile Name"
                    placeholder="Enter profile name"
                    icon={<IconUser size={14} />}
                    value={formData.profileName}
                    onChange={(e) => handleChange('profileName', e.currentTarget.value)}
                    mb="md"
                />

                <Select
                    label="Music Genre"
                    placeholder="Select music genre"
                    data={[
                        { value: 'rock', label: 'Rock' },
                        { value: 'melody', label: 'Melody' },
                        { value: 'jazz', label: 'Jazz' },
                    ]}
                    icon={<IconMusic size={14} />}
                    value={formData.musicGenre}
                    onChange={(value) => handleChange('musicGenre', value)}
                    mb="md"
                />

                <Textarea
                    label="Performance Details"
                    placeholder="Enter performance details"
                    value={formData.performanceDetails}
                    onChange={(e) => handleChange('performanceDetails', e.currentTarget.value)}
                    mb="md"
                />

                <Button fullWidth onClick={handleSubmit}>
                    Submit Profile
                </Button>

                {notification && (
                    <Notification
                        icon={notification.success ? <IconCheck size={18} /> : <IconX size={18} />}
                        color={notification.success ? 'teal' : 'red'}
                        mt="md"
                        title={notification.success ? 'Success' : 'Error'}
                        onClose={() => setNotification(null)}
                    >
                        {notification.message}
                    </Notification>
                )}
            </Card>
        </div>
    );
}
