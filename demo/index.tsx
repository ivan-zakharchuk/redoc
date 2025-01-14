import * as React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { resolve as urlResolve } from 'url';
import { RedocStandalone } from '../src';
import ComboBox from './components/ComboBox';
import ThemeSettings, { buildThemeConfig } from './components/ThemeSettings';
import { ThemeInterface } from '../src/theme';
import { updateQueryStringParameter } from './utils';

const DEFAULT_SPEC = 'openapi.yaml';
const NEW_VERSION_SPEC = 'openapi-3-1.yaml';

const demos = [
  { value: NEW_VERSION_SPEC, label: 'Petstore OpenAPI 3.1' },
  { value: 'https://api.apis.guru/v2/specs/instagram.com/1.0.0/swagger.yaml', label: 'Instagram' },
  {
    value: 'https://api.apis.guru/v2/specs/googleapis.com/calendar/v3/openapi.yaml',
    label: 'Google Calendar',
  },
  { value: 'https://api.apis.guru/v2/specs/slack.com/1.7.0/openapi.yaml', label: 'Slack' },
  { value: 'https://api.apis.guru/v2/specs/zoom.us/2.0.0/openapi.yaml', label: 'Zoom.us' },
  { value: 'https://docs.graphhopper.com/openapi.json', label: 'GraphHopper' },
];

class DemoApp extends React.Component<
  {},
  { specUrl: string; dropdownOpen: boolean; cors: boolean, theme: ThemeInterface }
> {
  constructor(props) {
    super(props);

    const url = getSpecUrl();
    const cors = getCors();
    const theme = buildThemeConfig("#000000");

    this.state = {
      specUrl: url,
      dropdownOpen: false,
      cors,
      theme,
    };
  }

  onUrlChange = (url: string) => {
    if (url === NEW_VERSION_SPEC) {
      this.setState({ cors: false })
    }

    this.setState({
      specUrl: url,
    });

    window.history.pushState(
      undefined,
      '',
      updateQueryStringParameter(location.search, 'url', url),
    );
  };

  onThemingChange = (theme) => this.setState({ theme })

  toggleCors = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cors = e.currentTarget.checked;

    this.setState({ cors });

    window.history.pushState(
      undefined,
      '',
      updateQueryStringParameter(location.search, 'nocors', cors ? undefined : ''),
    );
  };

  render() {
    const { specUrl, cors, theme } = this.state;
    const selectedSpecUrl = specUrl === DEFAULT_SPEC ? '' : specUrl;
    const proxiedUrl = cors && specUrl !== DEFAULT_SPEC
      ? '\\\\cors.redoc.ly/' + urlResolve(window.location.href, specUrl)
      : specUrl;

    return (
      <>
        <Heading>
          <a href=".">
            <Logo
              src="https://github.com/Redocly/redoc/raw/master/docs/images/redoc-logo.png"
              alt="Redoc logo"
            />
          </a>
          <ControlsContainer>
            <ComboBox
              placeholder={'URL to a spec to try'}
              options={demos}
              onChange={this.onUrlChange}
              value={ selectedSpecUrl }
            />
            <CorsCheckbox title="Use CORS proxy">
              <input id="cors_checkbox" type="checkbox" onChange={this.toggleCors} checked={cors} />
              <label htmlFor="cors_checkbox">CORS</label>
            </CorsCheckbox>
            <ThemeSettings onChange={ this.onThemingChange } theme={ theme }/>
          </ControlsContainer>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=Redocly&amp;repo=redoc&amp;type=star&amp;count=true&amp;size=large"
            frameBorder="0"
            scrolling="0"
            width="160px"
            height="30px"
          />
        </Heading>
        <RedocStandalone
          specUrl={proxiedUrl}
          options={{ scrollYOffset: 'nav', untrustedSpec: true, theme }}
        />
      </>
    );
  }
}

function getSpecUrl()
{
  const parts = window.location.search.match(/url=([^&]+)/);

  return parts && parts.length > 1
    ? decodeURIComponent(parts[1])
    : DEFAULT_SPEC;
}

function getCors()
{
  const parts = window.location.search.match(/[?&]nocors(&|#|$)/);

  return !(parts && parts.length > 1);
}

/* ====== Styled components ====== */

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  margin: 0 15px;
  align-items: center;
`;

const CorsCheckbox = styled.div`
  margin-left: 10px;
  white-space: nowrap;

  label {
    font-size: 13px;
  }

  @media screen and (max-width: 550px) {
    display: none;
  }
`;

const Heading = styled.nav`
  position: sticky;
  top: 0;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #cccccc;
  z-index: 10;
  padding: 5px;

  display: flex;
  align-items: center;
  font-family: Roboto, sans-serif;
`;

const Logo = styled.img`
  height: 40px;
  width: 124px;
  display: inline-block;
  margin-right: 15px;

  @media screen and (max-width: 950px) {
    display: none;
  }
`;

render(<DemoApp />, document.getElementById('container'));
