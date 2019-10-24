import React from "react"

class Lettering extends React.Component {
  render() {
    const letts = this.props.title.split("")
    return (
      <>
        {letts.map((lett, i) => (
          <span key={"char" + (i + 1)} className={"char char" + (i + 1)}>
            {lett}
          </span>
        ))}
      </>
    )
  }
}

export default Lettering
