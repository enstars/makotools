import CharacterList from "./CharacterList";

function Characters() {
    return (
        <>
            <div className="content-header">
                <h1>Characters</h1>
            </div>
            <div className="content-text">
                <CharacterList />
            </div>
        </>
    );
}

export default Characters;
