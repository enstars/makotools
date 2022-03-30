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
import { useAuth } from "../../services/auth";
import { EnsembleSquareLogo } from "../../public/logo_square";
import { Icon } from "@iconify/react";
import usersIcon from "@iconify/icons-tabler/users";
import playCard from "@iconify/icons-tabler/play-card";
import awardIcon from "@iconify/icons-tabler/award";
import book2 from "@iconify/icons-tabler/book-2";
import settingsIcon from "@iconify/icons-tabler/settings";
const StyledWrapper = styled.aside`
  /* background: #1e1e23; */
  font-family: "Metropolis", "InterVariable", "Inter";
  /* color: white; */
  position: fixed;
  top: 0px;
  height: 100vh;
  width: 200px;
  z-index: 2;
  overflow: auto;

  .es-sidebar__content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .es-sidebar__branding {
    font-weight: 800;
    line-height: 1;
    /* color: white; */
    position: relative;

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
      /* font-size: 0.8em; */
      /* text-transform: uppercase; */
      /* text-transform: lowercase; */
      text-decoration: none;
      letter-spacing: 0.05em;
      color: inherit;
      display: flex;
      align-items: center;

      padding: 5px 1em;
      opacity: 0.7;
      svg {
        margin-right: 0.5em;
        g {
          stroke-width: 1;
        }
      }

      &.active {
        opacity: 1;
        font-weight: 700;
        svg g {
          stroke-width: 2;
        }
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
        src={
          user.photoURL
            ? `/api/imageproxy?url=${encodeURIComponent(user.photoURL)}`
            : "/404_2.png"
        }
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
                icon: <Icon icon={usersIcon} />,
              },
              {
                link: "cards",
                name: "Cards",
                icon: <Icon icon={playCard} />,
              },
              {
                link: "events",
                name: "Events",
                icon: <Icon icon={awardIcon} />,
              },
              {
                link: "stories",
                name: "Stories",
                icon: <Icon icon={book2} />,
              },
              {
                link: "settings",
                name: "Settings",
                icon: <Icon icon={settingsIcon} />,
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
