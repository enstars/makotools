import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

const BreadcrumbsStyle = styled.div`
  color: rgba(255, 255, 255, 1);
  font-size: 0.7rem;
  font-weight: 700;
  font-family: "Metropolis";
  text-transform: uppercase;

  a,
  span {
    letter-spacing: 1px;
    transition: color 0.2s ease;
    /* margin-right: 0.5em; */

    text-decoration: none;

    &::after {
      content: " / ";
    }

    &:hover {
      color: var(--hokuto-300);
    }

    &:last-child {
      color: var(--ritsu-100);
    }

    &:last-child::after {
      content: ".";
    }
  }

  .MuiBreadcrumbs-separator {
    color: rgba(255, 255, 255, 0.5);
  }
`;

function Breadcrumbs() {
  const location = useRouter();
  const [pathnames, setPathnames] = useState(
    location.asPath.split("/").filter((x) => x)
  );

  useEffect(() => {
    setPathnames(location.asPath.split("/").filter((x) => x));
  }, [location]);

  return (
    <BreadcrumbsStyle>
      <Link color="inherit" href="/">
        <a>Ensemble Square</a>
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <span key={0}>{value}</span>
        ) : (
          <Link color="inherit" href={to} key={to}>
            <a>{value}</a>
          </Link>
        );
      })}
    </BreadcrumbsStyle>
  );
}

export default Breadcrumbs;
