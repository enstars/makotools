import Link from "next/link";
import styled from "styled-components";

const StyledFooter = styled.footer`

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  border: solid 1px var(--ritsu-600);

  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
  margin: var(--content-margin);


  .footer-content {
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
