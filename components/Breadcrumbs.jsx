import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import MUIBreadcrumbs from "@mui/material/Breadcrumbs";

const BreadcrumbsStyle = styled.div`
  .MuiBreadcrumbs-ol {
    color: rgba(255, 255, 255, 1);
    font-size: 0.7rem;
    font-weight: 500;
  }

  .MuiBreadcrumbs-li {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.2s ease;

    a {
      color: inherit;
      text-decoration: none;
    }

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }

    &:last-child {
      color: rgba(255, 255, 255, 1);
      font-weight: 800;
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
    location.asPath.split("/").filter((x) => x),
  );

  useEffect(() => {
    setPathnames(location.asPath.split("/").filter((x) => x));
  }, [location]);

  return (
    <BreadcrumbsStyle>
      <MUIBreadcrumbs aria-label="Breadcrumb">
        <Link color="inherit" href="/">
          <a>@ Ensemble Square</a>
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
      </MUIBreadcrumbs>
    </BreadcrumbsStyle>
  );
}

export default Breadcrumbs;
