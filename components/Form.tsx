import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModel from "@/hooks/useLoginModel";
import usePosts from "@/hooks/usePosts";
import useRegisterModel from "@/hooks/useRegisterModel";
import React, { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Button from './Button';
import Avatar from './Avatar';

interface Formprops{
    placeholder:string;
    isComment?:boolean;
    postId:string;
}

const Form:React.FC<Formprops> = ({placeholder,isComment,postId})=>{

    const regiterModel = useRegisterModel();
    const loginModel = useLoginModel();
    const {data:currentUser} = useCurrentUser();
    const {mutate:mutatePosts} = usePosts();

    const [body,setBody]=useState('');
    const [isLoading,setIsLoading] = useState(false);

    const onSubmit = useCallback(async ()=>{
        try {

            setIsLoading(true);

            await axios.post('/api/posts',{body});

            toast.success('Tweet Created');

            setBody('');
            mutatePosts();   
            
        } catch (error) {
            toast.error("Something Went Wrong");
        }finally{
            setIsLoading(false);
        }
    },[body,mutatePosts])


    return (
        <div className="border-b-[1px] border-neutral-800 px-5 py-2">
            {currentUser ? 
            (
                <div className="flex flex-row gap-4">
                    <div>
                        <Avatar userId={currentUser?.id}/>
                    </div>
                    <div className="w-full">
                        <textarea disabled={isLoading} onChange={(e)=>setBody(e.target.value)} value={body}
                                  className="disabled:opacity-80 peer resize-none mt-3 w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white" placeholder={placeholder}>
                        </textarea>
                        <hr className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />
                        <div className="mt-4 flex flex-row justify-end">
                            <Button label="Tweet" disabled={isLoading || !body} onClick={onSubmit}/>

                        </div>
                    </div>
                </div>
            ):
            (
                <div className="py-8">
                    <h1 className="text-white text-2xl text-center mb-4 font-bold">Welcome to Twitter</h1>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <Button label="Login" onClick={loginModel.onOpen}/>
                        <Button label="Register" onClick={regiterModel.onOpen} secondary />
                    </div>
                </div>
            )}

        </div>
    )
}

export default Form;
