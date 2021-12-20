import Link from "next/link";
import styled from "styled-components";

const StyledFooter = styled.footer`
  padding: 0;
  min-height: 300px;
  color: white;
  position: relative;
  background: bottom center / 100% no-repeat url("/footer_image.png");
  display: flow-root;

  &::before {
    float: left;
    padding-top: 50%;
    content: "";
  }

  &::after {
    display: block;
    content: "";
    clear: both;
  }

  .footer-content {
      margin: 100px 40px 20px;
      padding: 20px;
      border-radius: 5px;
      background: #101014c1;
      max-width: 400px;

      a {
          display: block;
      }
      .disclaimer {
          margin: 1em 0 0;
          font-size: 0.9em;
      }
  }

  .
`;

function Header() {
  return (
    <StyledFooter className="es-footer">
      {/* <div className="footer-bg">
        <Image
          src={FooterImage}
          alt="starmony dorm"
          layout="responsive"
          objectFit="cover"
        />
      </div> */}
      <div className="footer-content">
        Ensemble Square
        <Link href="/privacy-policy">
          <a>Privacy Policy</a>
        </Link>
        <p className="disclaimer">
          Not official nor related to Ensemble Stars!!, Happy Elements K.K, or
          Happy Elements in any way. All assets belong to their respective
          owners.
        </p>
      </div>
    </StyledFooter>
  );
}

export default Header;
