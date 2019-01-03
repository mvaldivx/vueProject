<template>
    <v-container fluid grid-list-lg class="file-input">
        <v-layout row>
            <v-flex xs12>
                <v-btn
                  :color="colorButton"
                  :class="classButton"
                  @click="onPickFile"
                  v-if="!imageUrl"
                >
                    {{ selectLabel }}
                    <v-icon right dark>{{ iconButton }}</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs6>
                <input
                    type="file"
                    ref="file"
                    name="file"
                    :accept="accept"
                    @change="onFilePicked"
                />
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs6>
                <v-text-field v-if="imageUrl" prepend-icon="attach_file" v-model="myfilename" :disabled="true">
                </v-text-field>
            </v-flex>
            <v-flex xs6>
                <v-btn
                  @click="removeFile"
                  v-if="imageUrl"
                  :class="`${classButton} error`"
                  :color="colorButton"
                  :small="smallButtonRemove"
                 >
                    {{ removeLabel }}              
                    <v-icon right dark>{{ iconButtonRemove }}</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: 'file-input',
        props: {
          value: {
              type: Boolean
          }
        },

        data() {
            return {
                imageUrl: '',
                myfilename: ''
            }
        },

        watch: {
            value(v) {
                this.imageUrl = v
            }
        },

        mounted() {
            this.imageUrl = this.value
        },

        methods: {
            onPickFile() {
                this.$refs.file.click()
            },

            onFilePicked(event) {
                this.myfilename = null
                const files = event.target.files || event.dataTransfer.files
                if (files && files[0]) {
                    let filename = files[0].name
                    this.myfilename = filename
                    if (filename && filename.lastIndexOf('.') <= 0) {
                        return //return alert('Please add a valid image!')
                    }

                    const fileReader = new FileReader()
                    fileReader.addEventListener('load', () => {
                        this.imageUrl = fileReader.result
                    })
                    fileReader.readAsDataURL(files[0])
                    this.$emit('input', files[0])
                }
            },

            removeFile() {
                this.imageUrl = ''
                this.$emit('input', null)
                this.myfilename = ''
                this.$refs.file.value = ''
            }
        }
    }
</script>

<style scoped>
    input[type=file] {
        position: absolute;
        left: -99999px;
    }

    .file-input .layout.row{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>