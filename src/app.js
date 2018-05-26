import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (<div>
            <form method="post" action="/answer" enctype="multipart/form-data">
                <input name="filename" type="file"/>
                <input type="submit" value='שלח'/>
            </form>
        </div>)

    }
}


ReactDOM.render(<App/>, document.querySelector('.container'));