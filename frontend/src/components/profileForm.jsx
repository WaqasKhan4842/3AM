import { Card, TextInput, Textarea, Button, Title, Select } from '@mantine/core';
import { IconUser, IconMusic } from '@tabler/icons-react';

export function ProfileForm() {
    return (
        <div className="container">
            <Card shadow="sm" padding="lg" style={{ maxWidth: 600, margin: 'auto' }}>
                <Title order={2} mb="md">Create Profile</Title>

                <TextInput
                    label="Profile Name"
                    placeholder="Enter profile name"
                    icon={<IconUser size={14} />}
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
                    mb="md"
                />

                <Textarea
                    label="Performance Details"
                    placeholder="Enter performance details"
                    mb="md"
                />

                <Button fullWidth>
                    Submit Profile
                </Button>
            </Card>
        </div>
    );
}