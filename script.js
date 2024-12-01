const g = 9.81; // Aceleração da gravidade (m/s²)
        const rho = 1.225; // Densidade do ar (kg/m³)
        const dt = 0.01; // Intervalo de tempo (s)

        function lancamento(angulo, v0, massa, diametro, coefArrastro) {
            const v0_x = v0 * Math.cos((angulo * Math.PI) / 180);
            const v0_y = v0 * Math.sin((angulo * Math.PI) / 180);

            let x = [0];
            let y = [0];
            let velocidade = [v0_x, v0_y];
            const area = Math.PI * (diametro / 2) ** 2;

            while (y[y.length - 1] >= 0) {
                // Forças envolvidas
                const forca_gravidade = [0, -massa * g]; // A gravidade atua negativamente no eixo Y
                const v = Math.sqrt(velocidade[0] ** 2 + velocidade[1] ** 2); // Velocidade total

                // Cálculo da resistência do ar (arrasto)
                const arrastro = [
                    -0.5 * coefArrastro * rho * area * v * velocidade[0],
                    -0.5 * coefArrastro * rho * area * v * velocidade[1],
                ];

                // Aceleração devido à gravidade e ao arrasto
                const aceleracao = [
                    (arrastro[0] + forca_gravidade[0]) / massa,
                    (arrastro[1] + forca_gravidade[1]) / massa,
                ];

                // Atualização da velocidade
                velocidade[0] += aceleracao[0] * dt;
                velocidade[1] += aceleracao[1] * dt;

                // Atualização da posição
                x.push(x[x.length - 1] + velocidade[0] * dt);
                y.push(y[y.length - 1] + velocidade[1] * dt);
            }

            return { x, y };
        }

        function simulate() {
            const angulo = parseFloat(document.getElementById("angulo").value);
            const v0 = parseFloat(document.getElementById("v0").value);
            const massa = parseFloat(document.getElementById("massa").value);
            const diametro = parseFloat(document.getElementById("diametro").value);
            const coefArrastro = parseFloat(document.getElementById("coefArrastro").value);

            const { x, y } = lancamento(angulo, v0, massa, diametro, coefArrastro);
            drawTrajectory(x, y, angulo);
        }

        function drawTrajectory(x, y, angulo) {
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");

            // Limpa o canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calcula a área de segurança e ajusta os limites
            const margin = 50; // margem para evitar corte
            const maxX = Math.max(...x);
            const maxY = Math.max(...y);

            // Ajuste para garantir que o gráfico não ultrapasse os limites do canvas
            const scaleX = (canvas.width - 2 * margin) / maxX;
            const scaleY = (canvas.height - 2 * margin) / maxY;

            // Desenha eixos
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.moveTo(margin, canvas.height - margin);
            ctx.lineTo(canvas.width - margin, canvas.height - margin); // Eixo X
            ctx.moveTo(margin, canvas.height - margin);
            ctx.lineTo(margin, margin); // Eixo Y
            ctx.stroke();

            // Adiciona marcações nos eixos
            const intervalX = Math.max(1, Math.floor(maxX / 10));
            const intervalY = Math.max(1, Math.floor(maxY / 10));

            ctx.font = "12px Arial";
            ctx.fillStyle = "black";

            // Eixo X
            for (let i = 0; i <= maxX; i += intervalX) {
                const posX = margin + i * scaleX;
                ctx.fillText(i.toFixed(0) + "m", posX, canvas.height - 30);
                ctx.beginPath();
                ctx.moveTo(posX, canvas.height - margin);
                ctx.lineTo(posX, canvas.height - margin + 5);
                ctx.stroke();
            }

            // Eixo Y
            for (let i = 0; i <= maxY; i += intervalY) {
                const posY = canvas.height - margin - i * scaleY;
                ctx.fillText(i.toFixed(0) + "m", 10, posY);
                ctx.beginPath();
                ctx.moveTo(margin, posY);
                ctx.lineTo(margin + 5, posY);
                ctx.stroke();
            }

            // Desenha o canhão no ponto (0,0)
            const cannonRadius = 10;
            ctx.beginPath();
            ctx.arc(margin, canvas.height - margin, cannonRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#555";
            ctx.fill();
            ctx.stroke();

            // Desenha a "boca" do canhão
            const cannonLength = 30;
            ctx.beginPath();
            ctx.moveTo(margin, canvas.height - margin);
            ctx.lineTo(margin + cannonLength * Math.cos((angulo * Math.PI) / 180), canvas.height - margin - cannonLength * Math.sin((angulo * Math.PI) / 180));
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#333";
            ctx.stroke();

            // Desenha a trajetória da bola
            let i = 0;
            const ballRadius = 5; // Raio da bola
            const interval = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Desenha os eixos e o canhão novamente para garantir que apareçam durante a animação
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.moveTo(margin, canvas.height - margin);
                ctx.lineTo(canvas.width - margin, canvas.height - margin); // Eixo X
                ctx.moveTo(margin, canvas.height - margin);
                ctx.lineTo(margin, margin); // Eixo Y
                ctx.stroke();

                // Adiciona marcações nos eixos
                for (let j = 0; j <= maxX; j += intervalX) {
                    const posX = margin + j * scaleX;
                    ctx.fillText(j.toFixed(0) + "m", posX, canvas.height - 30);
                    ctx.beginPath();
                    ctx.moveTo(posX, canvas.height - margin);
                    ctx.lineTo(posX, canvas.height - margin + 5);
                    ctx.stroke();
                }
                for (let j = 0; j <= maxY; j += intervalY) {
                    const posY = canvas.height - margin - j * scaleY;
                    ctx.fillText(j.toFixed(0) + "m", 10, posY);
                    ctx.beginPath();
                    ctx.moveTo(margin, posY);
                    ctx.lineTo(margin + 5, posY);
                    ctx.stroke();
                }

                // Redesenha o canhão
                ctx.beginPath();
                ctx.arc(margin, canvas.height - margin, cannonRadius, 0, Math.PI * 2);
                ctx.fillStyle = "#555";
                ctx.fill();
                ctx.stroke();

                // Redesenha a boca do canhão
                ctx.beginPath();
                ctx.moveTo(margin, canvas.height - margin);
                ctx.lineTo(margin + cannonLength * Math.cos((angulo * Math.PI) / 180), canvas.height - margin - cannonLength * Math.sin((angulo * Math.PI) / 180));
                ctx.lineWidth = 5;
                ctx.strokeStyle = "#333";
                ctx.stroke();

                // Atualiza a posição da bola
                ctx.beginPath();
                ctx.arc(margin + x[i] * scaleX, canvas.height - margin - y[i] * scaleY, ballRadius, 0, Math.PI * 2);
                ctx.fillStyle = "#ff5733";
                ctx.fill();
                ctx.stroke();

                i++;
                if (i >= x.length) clearInterval(interval);
            }, dt * 1000); // Ajusta o intervalo para controlar a animação
        }