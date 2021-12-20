import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useAuth } from "../services/auth";
import { EnsembleSquareLogo } from "../public/logo_square";

const StyledWrapper = styled.aside`
  /* background: #1e1e23; */
  border-right: solid 1px hsla(0, 0%, 100%, 0.2);
  @keyframes slideInLeft {
    0% {
      transform: translate(-100%, 0px);
    }

    100% {
      transform: translate(0%, 0px);
    }
  }

  color: white;
  position: sticky;
  top: 0px;
  height: 100vh;
  margin-bottom: -100vh;
  width: 200px;
  z-index: 2;
  overflow: auto;

  scrollbar-width: thin;
  scrollbar-color: hsl(0, 0%, 40%) transparent;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar-thumb {
    background-color: hsl(0, 0%, 40%);
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    width: 10px;
    background-color: transparent;
  }

  .es-sidebar__content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }

  .es-sidebar__branding {
    flex: 0 0 auto;
    height: 30px;
    font-weight: 800;
    line-height: 1;
    color: white;
    position: relative;

    border-bottom: solid 1px hsla(0, 0%, 100%, 0.2);

    text-decoration: none;
    color: inherit;
    background: hsla(230, 76%, 20%, 0);
    display: grid;
    grid-template-columns: 1.2em 1fr;
    align-items: center;
    justify-content: start;

    transition: background 0.2s ease, color 0.2s ease;
    padding: 5px 1em;
    gap: 1em;

    svg {
      width: 1rem;
      height: auto;
      place-self: center;
    }
    span {
      padding-bottom: 2px;
    }
  }

  .es-sidebar__menu {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    margin: 10px 0px;
  }

  .es-sidebar__links {
    a {
      text-decoration: none;
      color: inherit;
      background: hsla(230, 76%, 20%, 0);
      display: grid;
      grid-template-columns: 1.2em 1fr;
      align-items: center;
      justify-content: start;

      transition: background 0.2s ease, color 0.2s ease;
      padding: 5px 1em;
      gap: 1em;

      svg {
        font-size: 1rem;
        place-self: center;
      }

      .profile-image {
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 32px;
        position: relative;
        place-self: center;
        overflow: hidden;
        border: solid 1px hsla(0, 0%, 100%, 0.2);
      }

      img:before {
        content: "";
        display: none;
      }

      span {
        font-size: 0.8rem;
      }

      &.active {
        background: hsla(0, 0%, 100%, 0.2);
        font-weight: 700;
      }
    }
  }

  .es-sidebar__account {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    div {
      span {
        display: block;
        text-align: right;
      }

      .es-sidebar__name {
        font-size: 0.9em;
        font-weight: 700;
      }

      .es-sidebar__email {
        font-size: 0.7em;
      }
    }

    img {
      height: 16px;
      width: 16px;
      background: white;
      border-radius: 50%;

      &:before {
        content: "";
        display: none;
      }
    }
  }

  @media only screen and (min-width: 1100px) {
    .es-sidebar__links {
      a {
        border-radius: 5px 0px 0px 5px;
      }
    }
  }
`;

function ProfileImage() {
  // eslint-disable-next-line prefer-const
  let [user, setUser] = useState({
    displayName: "Logged Out",
    photoURL: "/404_1.png",
  });
  const authUser = useAuth();
  useEffect(() => {
    user = authUser.user;
    if (user) {
      setUser(user);
    }
  }, [authUser]);
  return (
    <div className="profile-image">
      <Image
        referrerPolicy="no-referrer"
        src={user.photoURL}
        alt={user.displayName}
        objectFit="cover"
        layout="fill"
      />
    </div>
  );
}

function Sidebar() {
  const location = useRouter();

  return (
    <StyledWrapper className="es-sidebar">
      <div className="es-sidebar__content">
        <Link href="/">
          <a className="es-sidebar__branding">
            <EnsembleSquareLogo color="white" />
            <span>Ensemble Square</span>
          </a>
        </Link>
        <div className="es-sidebar__menu">
          <nav className="es-sidebar__links">
            {[
              {
                link: "characters",
                name: "Characters",
                icon: <GroupRoundedIcon />,
              },
              {
                link: "cards",
                name: "Cards",
                icon: <ContentCopyRoundedIcon />,
              },
              {
                link: "events",
                name: "Events",
                icon: <MilitaryTechRoundedIcon />,
              },
              {
                link: "stories",
                name: "Stories",
                icon: <ImportContactsRoundedIcon />,
              },
              {
                link: "user",
                name: "Profile",
                icon: <ProfileImage />,
              },
              {
                link: "settings",
                name: "Settings",
                icon: <SettingsRoundedIcon />,
              },
            ].map(({ link, name, icon }, i) => (
              <Link key={i} href={`/${link}`}>
                <a
                  className={
                    location.asPath.split("/")[1] === link ? "active" : ""
                  }
                >
                  {icon}
                  <span>{name}</span>
                </a>
              </Link>
            ))}
          </nav>
          <div className="es-sidebar__links" />
        </div>
      </div>
    </StyledWrapper>
  );
}

export default Sidebar;
