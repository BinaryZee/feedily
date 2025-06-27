import Button from "../../atoms/button";
import FeedbackAnimation from "../../atoms/feedback_animation";
import FeedilyHeading from "../../atoms/feedily_heading";

const LandingPage = () => {
    return (
        <div className="flex min-h-screen w-full md:w-[40vw] items-center flex-col justify-between py-8">
            <FeedilyHeading/>
            <p className="text-lg md:text-[25px] font-light text-center">Feedback in a Flick</p>
            <div className="flex-1 w-full flex items-center justify-center">
                <FeedbackAnimation/>
            </div>
            <div className="w-full md:w-[65%] h-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 px-4 md:px-0 pb-8 md:pb-0">
                <Button name={"SignIn"} href={"/sign-in"}/>
                <Button name={"SignUp"} href={"/sign-up"}/>
            </div>
        </div>
    );
}

export default LandingPage;