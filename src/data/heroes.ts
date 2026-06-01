import type { Hero } from "@/types/hero";
import heroesData from "../../public/data/heroes.json";

export const heroes = heroesData as Hero[];
