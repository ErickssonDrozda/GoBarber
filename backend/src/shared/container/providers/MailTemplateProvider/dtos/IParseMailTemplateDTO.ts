interface ITemplateVariables{
    [key: string]: string | number
}

export default interface IParseMailTemplateDTO {
    file: string;
    variables: ITemplateVariables;
}

//variables: { name: 'teste', link: 'teste' ...}
