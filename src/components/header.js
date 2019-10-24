import React from "react"
import AniLink from "gatsby-plugin-transition-link/AniLink"
import PropTypes from "prop-types"

import Headroom from "react-headroom"
import { ThemeToggler } from "gatsby-plugin-dark-mode"

class Header extends React.Component {
  render() {
    const { siteTitle } = this.props
    return (
      <header>
        <Headroom>
          <div className="navbar">
            <h1>
              <AniLink cover direction="down" bg="#8c61ff" to="/">
                {siteTitle}
              </AniLink>
            </h1>

            <ThemeToggler>
              {({ theme, toggleTheme }) => (
                <label className="tog">
                  <input
                    type="checkbox"
                    onChange={e =>
                      toggleTheme(e.target.checked ? "dark" : "light")
                    }
                    checked={theme === "dark"}
                  />
                  {theme === "dark" ? (
                    <div className="on">
                    </div>
                  ) : (
                    <div className="off">
                    </div>
                  )}
                </label>
              )}
            </ThemeToggler>
          </div>
        </Headroom>
      </header>
    )
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

export default Header
