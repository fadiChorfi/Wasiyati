"use server";

import { createClient } from "@/lib/supabase/server";
import { Offer } from "@/types/database";


type ActionResult <T> = 
    | { data: T; error: null }
    | { data: null; error: string }



export async function getOffers(): Promise<ActionResult<Offer[]>> {
    const supabase = await createClient();

    const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { data: null, error: "Unauthorized" };


    const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("price_dzd", {ascending: true})

    if (error) return {data: null, error: error.message}
    return {data, error: null}
}
