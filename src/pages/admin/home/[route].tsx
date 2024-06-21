import clsx from "clsx";
import { getCookie } from "cookies-next";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { rgba } from "polished";
import React from "react";
import styled from "styled-components";
import AdminHomeBanner from "../../../components/AdminHome/AdminHomeBanner";
import AdminHomeCollections from "../../../components/AdminHome/AdminHomeCollections";
import AdminHomeTopUsers from "../../../components/AdminHome/AdminHomeTopUsers";
import AdminHomeVerifiedDrops from "../../../components/AdminHome/AdminHomeVerifiedDrops";
import { Button_Style2 } from "../../../components/common/Button";
import { TopUserKind } from "../../../generated/graphql";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { GraphQLService } from "../../../services/GraphQLService";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import parseJwt from "../../../utils/parseJwt";

const { media, dark } = mixins;
const {
    colors: { neutrals, blue },
    typography: { captionBold1 },
    fonts: { Poppins },
} = variables;

const AdminHomeEdit: NextPage = () => {
    const router = useRouter();

    const routes = React.useMemo(
        () => [
            {
                slug: "banner",
                label: "Banner",
                Component: <AdminHomeBanner />,
            },
            {
                slug: "collections",
                label: "Featured Collections",
                Component: <AdminHomeCollections />,
            },
            {
                slug: "verified-drops",
                label: "Verified Drops",
                Component: <AdminHomeVerifiedDrops />,
            },
            {
                slug: "top-artist",
                label: "Top Artists",
                Component: <AdminHomeTopUsers kind={TopUserKind.TopArtist} />,
            },
            {
                slug: "top-collector",
                label: "Top Collectors",
                Component: (
                    <AdminHomeTopUsers kind={TopUserKind.TopCollector} />
                ),
            },
        ],
        []
    );

    const currentPath = router.query.route;
    const matchingRoute = React.useMemo(
        () => routes.find((route) => route.slug === currentPath),
        [currentPath, routes]
    );

    React.useEffect(() => {
        if (currentPath && !matchingRoute) {
            router.push("/");
        }
    }, [currentPath, matchingRoute, router]);

    const containerRef = React.useRef(null);
    const [active, setActive] = React.useState<boolean>(false);
    const closePopup = React.useCallback(() => setActive(false), []);

    useOnClickOutside(containerRef, closePopup);

    React.useEffect(() => {
        router.events.on("routeChangeStart", closePopup);

        return () => {
            router.events.off("routeChangeStart", closePopup);
        };
    }, []);

    return (
        <Container>
            <Sidebar ref={containerRef}>
                <SidebarInner
                    {...{ active }}
                    onClick={() => setActive((prev) => !prev)}
                >
                    <SidebarTop>{matchingRoute?.label}</SidebarTop>

                    <SidebarMenu>
                        {routes.map(({ slug, label }) => (
                            <Link
                                href={`/admin/home/${slug}`}
                                passHref
                                key={slug}
                            >
                                <SidebarMenuLink
                                    className={
                                        slug === matchingRoute?.slug
                                            ? "active"
                                            : ""
                                    }
                                >
                                    {label}
                                </SidebarMenuLink>
                            </Link>
                        ))}
                    </SidebarMenu>
                </SidebarInner>
            </Sidebar>

            <InnerContainer>{matchingRoute?.Component}</InnerContainer>
        </Container>
    );
};

const Container = styled.div`
    padding: 4px;
    display: flex;

    ${media.t`
        display: block;
        padding: 32px 16px 16px;
    `}
`;

const InnerContainer = styled.div`
    flex-grow: 1;
    height: calc(100vh - 88px);
    padding-left: 4px;
    overflow: auto;

    ${media.t`
        height: auto;
        padding-left: 0;
    `}
`;

const SidebarTop = styled.div`
    cursor: pointer;
    display: none;

    ${media.t`
        position: relative;

        width: 100%;
        border-radius: 12px;
        border: 2px solid ${neutrals[6]};
        background: none;
        ${Poppins}
        ${captionBold1}
        color: ${neutrals[2]};
        transition: border-color 0.2s, color 0.2s;

        min-height: 48px;
        display: flex;
        align-items: center;
        padding: 10px 14px;

        ${dark`
            border-color: ${neutrals[3]};
            color: ${neutrals[8]};

            &::after {
                box-shadow: inset 0 0 0 2px ${neutrals[3]};
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' viewBox='0 0 10 6'%3E%3Cpath fill-rule='evenodd' d='M9.207.793a1 1 0 0 0-1.414 0L5 3.586 2.207.793A1 1 0 1 0 .793 2.207l3.5 3.5a1 1 0 0 0 1.414 0l3.5-3.5a1 1 0 0 0 0-1.414z' fill='%23FCFCFD'/%3E%3C/svg%3E");
            }
        `}

        &::after {
            content: "";
            position: absolute;
            top: 50%;
            right: 8px;
            width: 32px;
            height: 32px;
            transform: translateY(-50%);
            border-radius: 50%;
            box-shadow: inset 0 0 0 2px ${neutrals[6]};
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' viewBox='0 0 10 6'%3E%3Cpath fill-rule='evenodd' d='M9.207.793a1 1 0 0 0-1.414 0L5 3.586 2.207.793A1 1 0 1 0 .793 2.207l3.5 3.5a1 1 0 0 0 1.414 0l3.5-3.5a1 1 0 0 0 0-1.414z' fill='%23777e91'/%3E%3C/svg%3E")
                no-repeat 50% 50% / 10px auto;
            transition: transform 0.2s;
        }
    `}
`;

const SidebarMenu = styled.div`
    display: flex;
    flex-direction: column;

    ${media.t`
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        border-radius: 12px;
        background: ${neutrals[8]};
        border: 2px solid ${neutrals[6]};
        box-shadow: 0 4px 12px ${rgba(neutrals[2], 0.1)};
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s;

        ${dark`
            background: ${neutrals[1]};
            border-color: ${neutrals[3]};
            box-shadow: 0 4px 12px ${rgba(neutrals[1], 0.1)};
        `}
    `}
`;

const SidebarInner = styled.div.attrs<{ active?: boolean }>(({ active }) => ({
    className: clsx({ active }),
}))`
    margin-bottom: auto;

    ${media.t`
      position: relative;
      z-index: 5;

      &.active {
        ${SidebarTop} {
          border-color: ${blue};

          &::after {
            transform: translateY(-50%) rotate(-180deg);
          }
        }

        ${SidebarMenu} {
          visibility: visible;
          opacity: 1;
        }
      }
    `}
`;

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0 0 256px;
    width: 256px;
    height: calc(100vh - 88px);
    padding-top: 24px;
    background: ${neutrals[8]};
    border-radius: 4px;

    ${media.d`
      flex: 0 0 180px;
      width: 180px;
    `}

    ${media.t`
      width: 100%;
      height: auto;
      margin-bottom: 16px;
      padding-top: 0;
      background: none;
    `}

    ${dark`
      background: #18191d;

      ${media.t`
        background: none;
      `}
    `}
`;

const SidebarMenuLink = styled.a`
    display: flex;
    align-items: center;
    height: 48px;
    ${Button_Style2}
    color: ${neutrals[4]};
    transition: color 0.2s;
    padding: 0 32px;

    ${media.t`
      padding: 0 14px;
    `}

    &:hover,
    &.active {
        color: ${neutrals[2]};

        ${media.t`
            background: ${neutrals[6]};
        `}

        ${dark`
            color: ${neutrals[7]};

            ${media.t`
                background: ${neutrals[2]};
            `}
        `}
    }
`;

export async function getServerSideProps(context: NextPageContext) {
    let jwt: string | undefined = getCookie("jwt", {
        req: context.req,
        res: context.res,
    })?.toString();

    if (jwt) {
        const address = parseJwt(jwt);

        const res = await GraphQLService.sdk()
            .GetUser({ address })
            .catch(() => null);

        if (res?.user?.isAdmin) {
            return { props: {} };
        }
    }

    return {
        redirect: {
            destination: "/",
        },
    };
}

export default AdminHomeEdit;
