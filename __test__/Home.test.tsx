import '@testing-library/jest-dom'
import {render,screen} from "@testing-library/react";
import Home from "@/app/page";

describe("Home",()=>{
    it("should have text Home",()=>{
        //Arrange
        render(<Home/>);
        //Act
        const myElement=screen.getByText("Home");
        //Assert
        expect(myElement).toBeInTheDocument();
    })

    it("should have text Page",()=>{
        //Arrange
        render(<Home/>);
        //Act
        const myElement=screen.getByText(/page/i);
        //Assert
        expect(myElement).toBeInTheDocument();
    })

    it("should have heading",()=>{
        //Arrange
        render(<Home/>);
        //Act
        const myElement=screen.getByRole("heading",{
            name:"Home"
        });
        //Assert
        expect(myElement).toBeInTheDocument();
    })
})