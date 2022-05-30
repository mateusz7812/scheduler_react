import styled from "styled-components";

const View = styled.div`
    background-color:rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 200px -50px gray inset;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
`;

const LoadingView = () => {
    return(
        <View>
            <img src="/loading.gif" width="400px"/>
        </View>
    )
}

export default LoadingView;