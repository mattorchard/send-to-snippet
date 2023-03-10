import { Snippet, Upsertable } from "../types/Domain";

export const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Ut ac vestibulum quam.
Proin pellentesque commodo justo eu gravida.
Donec fermentum volutpat urna eget eleifend.
Fusce blandit scelerisque eros at vulputate.
Quisque ornare auctor urna, bibendum laoreet nibh bibendum non.
Mauris lectus magna, ornare ac lectus vel, accumsan maximus diam.
Donec et porta nulla.
Etiam elit arcu, condimentum sit amet semper ut, egestas sit amet enim.


Aenean ornare, justo in dignissim aliquet, nisi libero consequat nibh, et viverra turpis purus quis arcu.
In sit amet vehicula metus.
In semper tempus ultricies.
Nullam accumsan, justo quis gravida consequat, arcu turpis consectetur lacus, in scelerisque enim tortor nec mi.
Mauris id urna eleifend, facilisis dolor at, condimentum velit.
Integer non nunc imperdiet, aliquam metus euismod, luctus enim.
Suspendisse placerat ultricies mi.
Aenean et tincidunt ex.
Nunc eget orci vitae nunc pretium tempor porta id urna.
Integer non leo molestie, ornare dui quis, cursus nulla.`;

export const sampleSnippets: Upsertable<Snippet>[] = [
  {
    title: "Sample Iframe Output",
    script: `// You can put visuals into the body of the the iframe that your code is run within.
document.body.innerText = input.toLowerCase();`,
  },
  {
    title: "Sample JSON Output",
    script: `// You can return text or serializable data and it will appear in the text output. 
const letterCounts = {};
for (const letter of input) {
  letterCounts[letter] = (letterCounts[letter] ?? 0) + 1;
}
return letterCounts;`,
  },
  {
    title: "Sample Effect",
    script: `// You can even write a script with no output or visuals, if you just want to run an effect.
window.alert(input);`,
  },
];

export const sampleSnippetSkeleton: Upsertable<Snippet> = {
  title: "",
  script: `return input.toUpperCase();`,
};
