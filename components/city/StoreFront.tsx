'use client'

export interface StoreFrontProps {
  sign: string
  signClass?: string
  facadeClass?: string
  children?: React.ReactNode
}

export function StoreFront({
  sign,
  signClass = '',
  facadeClass = '',
  children,
}: StoreFrontProps) {
  return (
    <div className={`building storefront ${facadeClass}`}>
      <div className={`store-sign ${signClass}`}>{sign}</div>
      <div className="store-facade">
        <div className="store-windows-top">
          <div className="store-window" />
          <div className="store-window" />
          <div className="store-window" />
        </div>
        <div className="store-windows-mid">
          <div className="store-window" />
          <div className="store-window" />
          <div className="store-window" />
        </div>
        <div className="store-door-row">
          <div className="store-window" />
          <div className="store-door" />
          <div className="store-window" />
        </div>
        {children}
      </div>
    </div>
  )
}
