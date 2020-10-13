import React from "react"
import { graphql } from "gatsby"
import { TimelineMax, Back, Power1 } from "gsap"
import TransitionLink, { TransitionPortal } from "gatsby-plugin-transition-link"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

class Index extends React.Component {
  constructor(props) {
    super(props)

    this.horizontal = this.horizontal.bind(this)
    this.vertical = this.vertical.bind(this)

    this.cover = React.createRef()
    this.mod = React.createRef()
  }

  horizontal = ({ length: seconds }, direction) => {
    const directionTo = direction === "left" ? "-100%" : "100%"
    const directionFrom = direction === "left" ? "100%" : "-100%"

    // convert ms to s for gsap
    // const seconds = length
    const half = seconds / 2

    return new TimelineMax()
      .set(this.cover, { y: 0, x: directionFrom, display: "block" })
      .to(this.cover, half, {
        x: "0%",
        ease: Power1.easeInOut,
      })
      .to(this.cover, half, {
        x: directionTo,
        ease: Power1.easeInOut,
      })
  }

  vertical = ({ length: seconds }, direction) => {
    const directionTo = direction === "up" ? "-100%" : "100%"
    const directionFrom = direction === "up" ? "100%" : "-100%"

    const half = seconds / 2

    return new TimelineMax()
      .set(this.cover, { y: directionFrom })
      .to(this.cover, half, {
        y: "0%",
        ease: Power1.easeInOut,
      })
      .set(this.mod, { opacity: 0 })
      .to(this.cover, half, {
        y: directionTo,
        ease: Power1.easeIn,
      })
  }

  moveInDirection = (props, direction) => {
    if (direction === "left" || direction === "right")
      return this.horizontal(props, direction)

    return this.vertical(props, direction)
  }

  char(node) {
    return new TimelineMax().staggerFrom(
      node.querySelectorAll(".char"),
      0.3,
      { ease: Back.ease, opacity: 0, y: "+=50" },
      0.05
    )
  }

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Home" />
        <Bio />
        <div className="blog-list" ref={(n) => (this.mod = n)}>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <article key={node.fields.slug}>
                <header>
                  <h2>
                    <TransitionLink
                      to={`/${node.fields.slug}`}
                      exit={{
                        length: 1,
                        trigger: ({ exit }) =>
                          this.moveInDirection(exit, "left"),
                        // state: { char: "exit state" },
                      }}
                      entry={{
                        delay: 0.5,
                        trigger: ({ node }) => this.char(node),
                      }}
                    >
                      {title}
                    </TransitionLink>
                  </h2>
                  <small>{node.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.spoiler || node.excerpt,
                    }}
                  />
                </section>
              </article>
            )
          })}
        </div>
        <TransitionPortal>
          <div
            ref={(n) => (this.cover = n)}
            style={{
              position: "fixed",
              background: "#8c61ff",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              transform: "translateY(100%)",
            }}
          />
        </TransitionPortal>
      </Layout>
    )
  }
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
          }
        }
      }
    }
  }
`
