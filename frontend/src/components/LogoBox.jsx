import { Link } from 'react-router-dom';
import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-white.png';
import logoSm from '@/assets/images/logo-sm.png';
const LogoBox = ({
  containerClassName,
  squareLogo,
  textLogo
}) => {
  return <div className={containerClassName ?? ''}>
      <Link to="/" className="logo-dark">

        <img src={logoDark} className={textLogo?.className} height={ 'auto'} width={ 180} alt="logo dark" />
      </Link>
      <Link to="/" className="logo-light">
        <img src={logoLight} className={textLogo?.className} height={'auto'} width={ 180} alt="logo light" />
      </Link>
    </div>;
};
export default LogoBox;