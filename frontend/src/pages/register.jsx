import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { createStyles, TextInput, PasswordInput, Text, Paper, Group, Button, Stack, Anchor } from '@mantine/core';

const useStyles = createStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
    },

    paper: {
        width: '40%',
        marginTop: '10%',
        [`@media (max-width: 600px)`]: {
            width: '90%',
        },
    },
}));

export default function Register() {
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            name: '',
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    const { classes } = useStyles();

    async function handleRegister(data) {
        try {
            await AuthService.register(data); // Call backend to register user
            navigate('/profile'); // Redirect to profile management page
        } catch (e) {
            alert('Registration failed');
        }
    }

    function navigateToLogin() {
        navigate('/login'); // Redirect to login page
    }

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.paper} radius="md" p="xl" withBorder>
                <Text size="lg" weight={500}>
                    Register as Contestant
                </Text>

                <form onSubmit={form.onSubmit(handleRegister)}>
                    <Stack>
                        <TextInput
                            required
                            label="Name"
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                        />
                        <TextInput
                            required
                            label="Email"
                            value={form.values.email}
                            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                            error={form.errors.email && 'Invalid email'}
                        />
                        <PasswordInput
                            required
                            label="Password"
                            value={form.values.password}
                            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                            error={form.errors.password && 'Password should include at least 6 characters'}
                        />
                    </Stack>

                    <Group position="apart" mt="xl">
                        <Button variant="gradient" gradient={{ from: 'red', to: 'yellow', deg: 60 }} type="submit">
                            Register
                        </Button>
                    </Group>
                </form>

                {/* Option to navigate to login */}
                <Group position="center" mt="md">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={navigateToLogin}
                        size="xs"
                    >
                        Already have an account? Login
                    </Anchor>
                </Group>
            </Paper>
        </div>
    );
}