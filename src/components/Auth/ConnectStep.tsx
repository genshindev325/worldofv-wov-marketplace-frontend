import { BreakpointsKeys } from "@/styles/theme";
import { LOGIN_PROVIDER, LOGIN_PROVIDER_TYPE } from "@toruslabs/openlogin";
import { isEmail } from "class-validator";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { IconBaseProps, IconType } from "react-icons";
import {
    FaApple,
    FaDiscord,
    FaFacebook,
    FaGithub,
    FaLine,
    FaLinkedin,
    FaReddit,
    FaTwitch,
    FaTwitter,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiWechat } from "react-icons/si";
import styled from "styled-components";
import { useLoginHandler } from "../../hooks/useLoginHandler";
import { Alert } from "../common/Alert";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { Grid } from "../common/Grid";
import { Text } from "../common/Text";
import { Input } from "../FormInputs/Input";
import Link from "../Link";

const SOCIAL_LOGIN_PROVIDERS: {
    id: LOGIN_PROVIDER_TYPE;
    Icon: IconType;
    color?: string; // If no color is supplied the theme contrast color will be used.
    label?: string; // If no label is supplied an icon button will be used.
}[] = [
    { id: LOGIN_PROVIDER.GOOGLE, Icon: FcGoogle, label: "Google" },
    { id: LOGIN_PROVIDER.FACEBOOK, Icon: FaFacebook, color: "#4267B2" },
    { id: LOGIN_PROVIDER.TWITTER, Icon: FaTwitter, color: "#1DA1F2" },
    { id: LOGIN_PROVIDER.DISCORD, Icon: FaDiscord, color: "#5865F2" },
    { id: LOGIN_PROVIDER.APPLE, Icon: FaApple, color: "#7D7D7D" },
    { id: LOGIN_PROVIDER.REDDIT, Icon: FaReddit, color: "#FF4500" },
    { id: LOGIN_PROVIDER.TWITCH, Icon: FaTwitch, color: "#6441A4" },
    { id: LOGIN_PROVIDER.LINKEDIN, Icon: FaLinkedin, color: "#0A66C2" },
    { id: LOGIN_PROVIDER.GITHUB, Icon: FaGithub },
    { id: LOGIN_PROVIDER.LINE, Icon: FaLine, color: "#00B900" },
    { id: LOGIN_PROVIDER.WECHAT, Icon: SiWechat, color: "#09B83E" },
];

export interface ConnectStepProps {
    socialsFirst?: boolean;
}

export default function ConnectStep({ socialsFirst }: ConnectStepProps) {
    const { t } = useTranslation();

    const isSync1 = useMemo(
        () =>
            typeof navigator === "object"
                ? navigator.userAgent.includes("Sync/")
                : false,
        []
    );

    // See https://stackoverflow.com/a/3540295
    const isMobile = useMemo(
        () =>
            typeof navigator === "object"
                ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                      navigator.userAgent
                  )
                : false,
        []
    );

    return (
        <Flex
            flexDirection={{
                _: socialsFirst ? "column-reverse" : "column",
                m: "column",
            }}
            alignItems="stretch"
            justifyContent="stretch"
            style={{ textAlign: "center" }}
            paddingX={3}
        >
            {isSync1 && <Sync1Alert />}

            <Flex
                alignItems="stretch"
                flexDirection={{
                    _: socialsFirst ? "column-reverse" : "column",
                    m: socialsFirst ? "row-reverse" : "row",
                }}
            >
                <Flex
                    flexDirection="column"
                    columnGap={3}
                    flexBasis="256px"
                    flex={1}
                >
                    <TextLoginButton
                        loginProvider="connex"
                        Icon={Sync2Icon}
                        label="Sync2"
                    />
                    {!isMobile && (
                        <TextLoginButton
                            loginProvider="connex"
                            Icon={VeWorldIcon}
                            label="VeWorld"
                        />
                    )}
                    <TextLoginButton
                        loginProvider="connex"
                        Icon={VeChainThorIcon}
                        label="VeChainThor"
                    />
                </Flex>

                <Divider verticalAt="m" />

                <Grid
                    gridTemplateRows="10"
                    gridRowGap={3}
                    flexBasis="256px"
                    flex={1}
                >
                    {SOCIAL_LOGIN_PROVIDERS.map(
                        ({ label, id, Icon, color }) => {
                            if (label) {
                                return (
                                    <TextLoginButton
                                        key={id}
                                        loginProvider={id}
                                        Icon={Icon}
                                        label={label}
                                    />
                                );
                            } else {
                                return (
                                    <IconLoginButton
                                        key={id}
                                        loginProvider={id}
                                        Icon={Icon}
                                        color={color}
                                    />
                                );
                            }
                        }
                    )}
                </Grid>
            </Flex>

            <Divider />

            <LoginWithEmail />
        </Flex>
    );
}

function Sync1Alert() {
    return (
        <Alert
            style={{
                maxWidth: "512px",
                marginInline: "auto",
                marginBottom: "16px",
            }}
            title="You are using an unsupported browser"
            text={
                <>
                    The social account login feature is disabled since the
                    VeChain Sync browser does not implement the required
                    functionality. Please consider migrating your wallet to{" "}
                    <Link href="https://www.veworld.net/">
                        <a target="_blank">VeWorld</a>
                    </Link>
                    .
                </>
            }
        />
    );
}

interface DividerProps {
    verticalAt?: keyof BreakpointsKeys;
}

function Divider({ verticalAt }: DividerProps) {
    const { t } = useTranslation();
    const marginX = verticalAt ? { _: 2, [verticalAt]: 4 } : 2;
    const marginY = verticalAt ? { _: 4, [verticalAt]: 2 } : 4;
    const borderLeft = verticalAt ? { _: 0, [verticalAt]: "1px" } : 0;
    const borderBottom = verticalAt ? { _: "1px", [verticalAt]: 0 } : "1px";

    return (
        <Box
            color="muted"
            borderStyle="solid"
            borderRightWidth={0}
            borderTopWidth={0}
            marginX={marginX}
            marginY={marginY}
            borderLeftWidth={borderLeft}
            borderBottomWidth={borderBottom}
            position="relative"
        >
            <Flex
                position="absolute"
                top={0}
                left={0}
                alignItems="center"
                justifyContent="center"
                height="100%"
                width="100%"
            >
                <Text
                    variant="captionBold2"
                    backgroundColor="background"
                    style={{ pointerEvents: "none" }}
                    px={2}
                >
                    {t("connect_step:or_separator")}
                </Text>
            </Flex>
        </Box>
    );
}

interface TextLoginButtonProps {
    Icon: IconType;
    label: string;
    loginProvider: LOGIN_PROVIDER_TYPE | "connex";
}

function TextLoginButton({ label, Icon, loginProvider }: TextLoginButtonProps) {
    const { t } = useTranslation();
    const { isDisabled, isLoggingIn, login } = useLoginHandler(loginProvider);

    return (
        <TextButton
            onClick={login}
            disabled={isDisabled}
            loader={isLoggingIn}
            outline
        >
            <Flex alignItems="center" justifyContent="center" width="100%">
                <Icon
                    size={32}
                    style={{ gridColumn: "span 10", marginLeft: "-16px" }}
                />
                <Text variant="body2" marginLeft={2} flex={1}>
                    {t("connect_step:login_with")} {label}
                </Text>
            </Flex>
        </TextButton>
    );
}

interface IconLoginButtonProps {
    Icon: IconType;
    loginProvider: LOGIN_PROVIDER_TYPE | "connex";
    color?: string;
}

function IconLoginButton({ Icon, loginProvider, color }: IconLoginButtonProps) {
    const { isDisabled, isLoggingIn, login } = useLoginHandler(loginProvider);

    return (
        <IconButton
            onClick={login}
            disabled={isDisabled}
            loader={isLoggingIn}
            outline
        >
            <Icon size={28} color={color} />
        </IconButton>
    );
}

function LoginWithEmail() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    const { isDisabled, isLoggingIn, login } = useLoginHandler(
        "email_passwordless",
        { login_hint: email }
    );

    const isValid = useMemo(() => isEmail(email), [email]);

    const submitButton = (
        <TextButton
            small
            loader={isLoggingIn}
            disabled={isDisabled || !isValid}
            onClick={() => login()}
            style={{
                minWidth: 0,
                width: "96px",
                marginRight: "-4px",
            }}
        >
            {t("connect_step:continue_button_label")}
        </TextButton>
    );

    return (
        <Input
            borderRadius={48}
            rightDecoration={submitButton}
            inputProps={{
                type: "email",
                placeholder:
                    t("connect_step:email_input_placeholder") ||
                    "Login with Email",
                disabled: isDisabled || isLoggingIn,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                onKeyUpCapture: (e) => {
                    if (e.key === "Enter" && isValid) {
                        login();
                    }
                },
            }}
        />
    );
}

function Sync2Icon({ children, size, color, title, ...props }: IconBaseProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle fill={color || "#0047ab"} cx="256" cy="256" r="256" />
            <path
                fill="white"
                d="M373.91 331.29a23.015 23.015 0 0 1-11.352 11.334l-184.355 92.002a6.214 6.214 0 0 1-7.17-2.216 5.367 5.367 0 0 1-.879-1.591 8.655 8.655 0 0 1-.35-2.423v-44.092c.026-.37.095-.734.207-1.087a8.45 8.45 0 0 1 3.982-5.062l125.716-62.723c8.078-4.485 10.997-14.648 6.529-22.724a16.524 16.524 0 0 0-6.361-6.422L149.45 211.194a22.994 22.994 0 0 1-13.45-20.91 22.994 22.994 0 0 1 13.45-20.91l184.354-92.001a6.21 6.21 0 0 1 7.163 2.216c.386.48.683 1.025.88 1.608.232.788.35 1.605.35 2.427v44.07a4.75 4.75 0 0 1-.207 1.091 8.446 8.446 0 0 1-3.982 5.06l-125.71 62.722c-8.096 4.483-11.022 14.667-6.535 22.752a16.562 16.562 0 0 0 6.357 6.422l150.438 75.064c11.557 5.3 16.635 18.937 11.352 30.485z"
            />
        </svg>
    );
}

function VeWorldIcon({
    children,
    size,
    color,
    title,
    ...props
}: IconBaseProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            width={size}
            height={size}
            {...props}
        >
            <circle fill={color || "black"} cx="64" cy="64" r="64" />
            <image
                width="116"
                height="116"
                x="6"
                y="8"
                href="data:image/png;base64,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 TkSuQmCC"
            />
        </svg>
    );
}

function VeChainThorIcon({
    children,
    size,
    color,
    title,
    ...props
}: IconBaseProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 225.000000 225.000000"
            width={size}
            height={size}
            {...props}
        >
            <circle fill="white" cx="112.5" cy="112.5" r="100" />
            <g
                transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)"
                fill={color || "#154d8a"}
                stroke="none"
            >
                <path d="M985 2239 c-373 -47 -709 -293 -874 -640 -148 -311 -143 -657 14 -974 65 -131 127 -216 230 -314 303 -287 733 -383 1128 -251 285 96 538 322 661 593 193 423 113 907 -205 1242 -98 103 -183 165 -314 230 -210 105 -418 141 -640 114z m290 -414 c73 -17 146 -48 201 -86 l41 -28 11 24 c7 14 15 25 20 25 18 0 139 -133 174 -191 130 -214 138 -449 25 -679 -32 -66 -59 -102 -122 -165 -44 -44 -109 -97 -145 -118 -63 -36 -218 -93 -228 -83 -2 3 1 18 7 34 9 22 23 32 54 42 80 23 182 85 254 153 l72 69 -23 47 c-24 46 -24 46 -5 81 61 114 79 275 44 398 -10 34 -21 65 -25 67 -4 2 -46 -75 -93 -173 -47 -97 -158 -325 -247 -507 l-162 -330 -249 503 c-138 276 -254 502 -258 502 -17 0 -42 -123 -42 -204 -1 -92 10 -143 48 -229 l26 -58 -22 -47 -23 -47 74 -70 c73 -70 173 -131 254 -155 31 -9 45 -21 58 -46 8 -19 12 -34 7 -34 -26 0 -155 47 -216 78 -90 47 -226 181 -273 269 -121 230 -117 480 12 696 36 61 158 197 176 197 4 0 12 -11 18 -25 l12 -26 43 29 c54 37 148 78 222 95 45 11 224 6 280 -8z" />
                <path d="M1020 1744 c-53 -11 -160 -56 -204 -88 l-46 -32 76 -155 c42 -85 89 -181 104 -214 16 -33 61 -128 102 -211 l73 -152 175 366 c96 201 174 368 174 371 -4 12 -133 83 -179 97 -49 16 -227 27 -275 18z m207 -113 c21 -6 55 -11 76 -11 20 0 37 -2 37 -5 0 -2 -5 -26 -11 -54 l-10 -49 -53 5 c-48 5 -54 3 -74 -22 -28 -36 -37 -88 -22 -125 10 -24 10 -33 -1 -46 -11 -13 -10 -21 4 -47 13 -25 15 -44 9 -82 l-7 -50 -43 -3 c-38 -3 -43 0 -52 23 -13 35 -13 92 1 101 7 4 9 22 4 50 -3 25 -2 52 5 64 14 26 -3 93 -32 122 -17 17 -29 20 -74 15 l-53 -5 -10 49 c-6 28 -11 52 -11 54 0 3 17 5 38 5 57 0 110 18 145 50 l32 28 32 -28 c18 -16 49 -34 70 -39z" />
            </g>
        </svg>
    );
}

const IconButton = styled(Button)`
    padding: 0;
    height: 48px;
    width: 48px;
    border-radius: 50%;
    grid-column: span 2;
`;

const TextButton = styled(Button)`
    grid-column: span 10;
    width: 100%;
    min-width: 256px;
`;
