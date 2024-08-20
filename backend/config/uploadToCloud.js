import { createClient } from "@supabase/supabase-js"
import dotenv from 'dotenv';

dotenv.config();

export const uploadAudioToCloud = async(fileBuffer,fileName) =>{

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data } = await supabase
            .storage
            .from('audios')
            .upload(`${fileName}`, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'audio/mp3',
            });
            
        return data;

}