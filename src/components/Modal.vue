<template>
  <div id="modal" :class="hide && 'hide'">
    <div class="content">
      <h1>Tenho uma notícia para você! 😢</h1>
      <h2>Sua conta do Spotify não é Premium</h2>
      <p>
        <strong> Lucasmg37</strong>, notamos que a conta que você usou para se
        autenticar não é <strong> Premium</strong>.<br />
        Com isso, algumas funcionalidades não estarão disponíveis, como:
      </p>

      <ul>
        <li>Reproduzir músicas dentro da plataforma;</li>
        <li>Acionar a função de play em músicas e playlists da plataforma.</li>
      </ul>

      <p>
        Isso acontece porque usamos a API do Spotify para obter informações e
        acionar os comandos de reprodução dentro da plataforma. <br />
        Deixamos claro que não temos nenhuma relação com o Spotify, e não temos
        a itenção de promover ou incentivar a utilização do Serviço.
      </p>

      <h3>Mas não fique triste! 😉</h3>
      <p>
        Você ainda poderá navegar na plataforma, gerenciar suas playlists e
        ouvir as prévias de qualquer música!
      </p>
    </div>
    <div class="button">
      <button @click="onCloseAction">
        Conhecer a Plataforma <ph-arrow-right :size="32" />
      </button>
    </div>
  </div>
</template>

<script>
import { PhArrowRight } from 'phosphor-vue';

export default {
  name: 'Modal',
  components: { PhArrowRight },
  props: ['onClose'],
  data() {
    return {
      hide: false,
    };
  },
  methods: {
    onCloseAction() {
      this.hide = true;

      setTimeout(() => {
        this.onClose();
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
#modal {
  @keyframes hide {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      height: 0px;
      overflow: hidden;
    }
  }

  &.hide {
    animation: hide 0.5s ease-in-out forwards;
  }

  color: #fff;
  position: absolute;
  z-index: 999;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  background: #08081abe;
  backdrop-filter: blur(10px);

  .button {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    > button {
      @keyframes arrow {
        0% {
          transform: translateX(0px);
        }
        100% {
          transform: translateX(100px);
          opacity: 0;
        }
      }

      transform: scale(0.9);
      transition: cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s;
      padding: 16px 40px;
      border-radius: 40px;
      background: rgb(29, 185, 84);
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #fff;
      font-size: 32px;
      font-weight: 600;

      &:hover {
        transform: scale(1);

        > svg {
          animation: arrow 1s ease-in-out infinite;
        }
      }

      > svg {
        color: #fff;
        margin-left: 24px;
      }
    }
  }

  .content {
    padding: 40px;

    h1 {
      font-size: 40px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 32px;
      font-weight: 400;
      margin-bottom: 24px;
    }

    h3 {
      font-size: 32px;
      font-weight: 400;
      margin-top: 24px;
      margin-bottom: 8px;
    }

    ul {
      list-style: disc;
      font-size: 18px;
      margin-left: 24px;
      margin-bottom: 24px;
    }

    > p {
      max-width: 720px;
      font-size: 18px;
      margin-bottom: 16px;
      line-height: 24px;

      &:last-child {
        font-weight: 600;
        color: rgb(29, 185, 84);
      }
    }
  }
}
</style>