import { createStyles, Text, Title, Button, Container, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function Home() {
    let [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = window.localStorage.getItem("user");
        const token = window.localStorage.getItem("token");

        if (userStr && token) {
            setUser(JSON.parse(userStr));
            console.log(user);
        }
    }, []);

    const { classes } = useStyles();
    return (
        <div className={classes.wrapper}>
            <div className={classes.body}>
                <div className={classes.header}>
                    <Title className={classes.title}>Online Singing Competition Management System</Title>
                </div>
                <Text weight={500} size="lg" mb={5}>
                    <code>Authors: <a className={classes.title} href="https://github.com/umair228/3AM/">Umair, Waqas, Umar</a></code>
                </Text>
                <Text size="md" color="dimmed">
                    <code>3AM</code>
                </Text>
                <br />
                {user ? (
                    <div>
                        <p className={classes.title}>Logged in As {user.name}</p>
                        <Button onClick={() => {
                            window.localStorage.removeItem("user");
                            window.localStorage.removeItem("token");
                            setUser(null);
                        }} size='md' variant="gradient"
                                gradient={{ from: 'red', to: 'yellow', deg: 60 }}>
                            Log Out
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Link to="/register">
                            <Button size='md' variant="gradient"
                                    gradient={{ from: 'red', to: 'yellow', deg: 60 }}
                                    className={classes.buttons}>
                                Register
                            </Button>
                        </Link>
                        <strong>/</strong>
                        <Link to="/login">
                            <Button size='md' variant="gradient"
                                    gradient={{ from: 'red', to: 'yellow', deg: 60 }}
                                    className={classes.buttons}>
                                Login
                            </Button>
                        </Link>
                    </div>
                )}
                <Group className={classes.links}>
                    <Link to="/audience-voting">
                        <Button size='md' variant="gradient"
                                gradient={{ from: 'blue', to: 'cyan', deg: 60 }}
                                className={classes.buttons}>
                            Audience Voting
                        </Button>
                    </Link>
                    <Link to="/results">
                        <Button size='md' variant="gradient"
                                gradient={{ from: 'green', to: 'lime', deg: 60 }}
                                className={classes.buttons}>
                            Contestant Results
                        </Button>
                    </Link>
                    <Link to="/judge-panel">
                        <Button size='md' variant="gradient"
                                gradient={{ from: 'purple', to: 'pink', deg: 60 }}
                                className={classes.buttons}>
                            Judge Panel
                        </Button>
                    </Link>
                    <Link to="/organizer-dashboard">
                        <Button size='md' variant="gradient"
                                gradient={{ from: 'orange', to: 'red', deg: 60 }}
                                className={classes.buttons}>
                            Organizer Portal
                        </Button>
                    </Link>
                    <Link to="/dashboard">
                        <Button size='md' variant="gradient"
                                gradient={{ from: 'teal', to: 'lime', deg: 60 }}
                                className={classes.buttons}>
                            Contestant Dashboard
                        </Button>
                    </Link>
                </Group>
            </div>
            <footer className={classes.footer}>
                <Text size="sm" color="dimmed">
                    &copy; 2025 Team 3AM FAST NUCES. All rights reserved.
                </Text>
            </footer>
        </div>
    );
}

const useStyles = createStyles((theme) => ({
    wrapper: {
        margin: '10rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8rem',
        borderRadius: theme.radius.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        position: 'relative',

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            padding: theme.spacing.xl,
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: 'monospace',
        lineHeight: 1,
        fontWeight: 'bold',
        textDecoration: 'none',
        marginBottom: theme.spacing.md,
    },

    buttons: {
        margin: '10px',
        fontFamily: 'monospace',
    },

    body: {
        paddingRight: theme.spacing.xl * 4,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            paddingRight: 0,
            marginTop: theme.spacing.xl,
        },
    },

    header: {
        display: 'flex',
        alignItems: 'center',
    },

    links: {
        marginTop: theme.spacing.lg,
    },

    image: {
        width: '20%',
        height: 'auto',
        marginLeft: theme.spacing.md,
    },

    footer: {
        marginTop: theme.spacing.xl,
        textAlign: 'center',
    },
}));