import { ComponentType } from 'react'
import { PortableTextInputProps } from 'sanity'
import { Box } from '@sanity/ui'

const NumberedHeadingPTEInput: ComponentType<PortableTextInputProps> = (props) => {
  return (
    <>
      <style>{`
              .pt-editable { 
                counter-reset: headingOne headingTwo headingThree headingFour;
                .h1-counter {
                  counter-set: headingTwo 0;
                  [data-slate-string="true"]:before {
                    counter-increment: headingOne;
                    content: counter(headingOne) ". ";
                  }
                }
                
                .h2-counter {
                  counter-set: headingThree 0;
                  [data-slate-string="true"]:before {
                    counter-increment: headingTwo;
                    content: counter(headingOne) "." counter(headingTwo) ". ";
                  }
                } 

                .h3-counter {
                  counter-set: headingFour 0; 
                  [data-slate-string="true"]:before {
                    counter-increment: headingThree;
                    content: counter(headingOne) "." counter(headingTwo) "." counter(headingThree) ". ";
                  }
                }
                
                .h4-counter{
                  [data-slate-string="true"]:before {
                    counter-increment: headingFour;
                    content: counter(headingOne) "." counter(headingTwo) "." counter(headingThree) "." counter(headingFour) ". ";
                  }
                }
              }
          `}</style>
      <Box className={'set-counters'}>{props.renderDefault(props)}</Box>
    </>
  )
}
export default NumberedHeadingPTEInput
