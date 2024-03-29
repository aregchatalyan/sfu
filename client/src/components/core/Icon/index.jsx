import React, { memo } from 'react'
import iconPaths from '../../../assets/icon/paths.json'

const Icon = ({ name, width, height, ...otherProps }) => {
  return (
    <div
      {...{ ...otherProps }}
      style={{
        width,
        height,
        padding: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        {...{ width, height }}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: iconPaths[name] }}
      />
    </div>
  )
}

export default memo(Icon)
