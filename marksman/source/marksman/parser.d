module marksman.parser;

enum EType : ubyte
{
    Code,
    Paragraph,
    Separator,
}

enum EMod : ubyte
{
    Bold = 1 << 0,
    Italic = 1 << 1,
    Inline = 1 << 2
}

struct MDElem
{
    EType type;
    EMod mod;
    string str;
    union
    {
        // For links, this is the link.
        // For images, this is the source.
        // For code, this is the language.
        string ctx;
    }
}

MDElem[] parse(string str)
{
    foreach (char c; str)
    {

    }
}