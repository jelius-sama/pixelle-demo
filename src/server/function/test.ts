"use server";

export default async function testServerFunction({ props }: { props: { firstName: string, lastName?: string; honarific?: "san" | "kun" | "sama" | "tan" | "chan"; }; }) {
    return props.lastName ? `Greetings by ${props.firstName} ${props.lastName}, the dev of this webapp.` : `Greettings by ${props.firstName}${props.honarific && "-" + props.honarific}, the dev of this webapp.`;
}
