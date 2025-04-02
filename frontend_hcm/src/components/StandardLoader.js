import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const LoaderContent = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`

const Logo = styled.img`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid rgba(0, 75, 154, 0.1);
  border-top-color: #004b9a;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${spin} 1s linear infinite;
`

const StandardLoader = () => (
  <LoaderWrapper>
    <LoaderContent>
      <Logo 
        src="/logo-1.png"
        alt="UNIMAR"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="%23004b9a">V</text></svg>'
        }}
      />
      <Spinner />
    </LoaderContent>
  </LoaderWrapper>
)

export default StandardLoader