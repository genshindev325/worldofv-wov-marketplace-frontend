import { useTranslation } from "next-i18next";
import { Flex } from "./common/Flex";
import { Text } from "./common/Text";
import Link from "./Link";

/**
 * Google wants us to include the reCAPTCHA branding visibly in the user flow.
 * See https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed
 */
export default function ReCaptchaBanner() {
    const { t } = useTranslation();

    return (
        <Flex flexDirection="column" columnGap={2}>
            <Text variant="caption3" color="accent" textAlign="center">
                {t("recaptcha_banner:line_one")}{" "}
                <b>
                    <Link href="https://policies.google.com/privacy">
                        {t("recaptcha_banner:line_two")}
                    </Link>
                </b>{" "}
                {t("recaptcha_banner:line_three")}{" "}
                <b>
                    <Link href="https://policies.google.com/terms">
                        {t("recaptcha_banner:line_four")}
                    </Link>
                </b>{" "}
                {t("recaptcha_banner:line_five")}
            </Text>
        </Flex>
    );
}
